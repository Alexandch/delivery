document.addEventListener('DOMContentLoaded', function () {
    const office = { lat: 53.902284, lng: 27.561831 };
    const address = document.getElementById('companyAddress').textContent.trim();
    const locationInfo = document.getElementById('locationInfo');
    const mapStatus = document.getElementById('mapStatus');
    let map;
    let routeLine;
    let userMarker;

    function setLocationMessage(message, type = 'info') {
        locationInfo.hidden = false;
        locationInfo.className = `location-info ${type}`;
        locationInfo.textContent = message;
    }

    function distanceKm(from, to) {
        const radius = 6371;
        const toRad = value => value * Math.PI / 180;
        const dLat = toRad(to.lat - from.lat);
        const dLng = toRad(to.lng - from.lng);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
        return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function initMap() {
        const routeMap = document.getElementById('routeMap');
        if (!window.L) {
            routeMap.innerHTML = '<iframe class="map-iframe" title="Карта расположения офиса" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.openstreetmap.org/export/embed.html?bbox=27.541831%2C53.892284%2C27.581831%2C53.912284&amp;layer=mapnik&amp;marker=53.902284%2C27.561831"></iframe>';
            mapStatus.textContent = 'Интерактивная карта недоступна, показана резервная карта офиса.';
            return;
        }
        map = L.map('routeMap', { scrollWheelZoom: false }).setView([office.lat, office.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        L.marker([office.lat, office.lng]).addTo(map).bindPopup(address).openPopup();
    }

    function drawFallbackLine(current) {
        const points = [[current.lat, current.lng], [office.lat, office.lng]];
        routeLine = L.polyline(points, { color: '#2c5aa0', weight: 5, opacity: .85, dashArray: '8 8' }).addTo(map);
        map.fitBounds(routeLine.getBounds(), { padding: [35, 35] });
    }

    async function buildRoute(current) {
        if (!map || !window.L) return;
        if (routeLine) routeLine.remove();
        if (userMarker) userMarker.remove();
        userMarker = L.marker([current.lat, current.lng]).addTo(map).bindPopup('Вы здесь');
        try {
            const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${current.lng},${current.lat};${office.lng},${office.lat}?overview=full&geometries=geojson&alternatives=false&steps=false`);
            if (!response.ok) throw new Error('route failed');
            const data = await response.json();
            const route = data.routes && data.routes[0];
            if (!route) throw new Error('route empty');
            const points = route.geometry.coordinates.map(point => [point[1], point[0]]);
            routeLine = L.polyline(points, { color: '#2c5aa0', weight: 5, opacity: .9 }).addTo(map);
            map.fitBounds(routeLine.getBounds(), { padding: [35, 35] });
            const km = route.distance / 1000;
            const minutes = Math.max(1, Math.round(route.duration / 60));
            mapStatus.textContent = `Маршрут построен: примерно ${km.toFixed(1)} км, ${minutes} мин.`;
            setLocationMessage(`Маршрут до офиса построен на карте: примерно ${km.toFixed(1)} км и ${minutes} мин на автомобиле.`, 'success');
        } catch (error) {
            drawFallbackLine(current);
            const distance = distanceKm(current, office);
            mapStatus.textContent = 'Сервис маршрутов временно недоступен, показана прямая линия до офиса.';
            setLocationMessage(`Точный маршрут временно недоступен. До офиса примерно ${distance.toFixed(1)} км по прямой.`, 'warning');
        }
    }

    document.getElementById('getLocationBtn').addEventListener('click', function () {
        if (!navigator.geolocation) {
            setLocationMessage('Ваш браузер не поддерживает определение местоположения.', 'warning');
            return;
        }
        setLocationMessage('Определяем ваше местоположение...');
        navigator.geolocation.getCurrentPosition(function (position) {
            const current = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            const distance = distanceKm(current, office);
            setLocationMessage(`Местоположение определено. До офиса примерно ${distance.toFixed(1)} км по прямой, строим маршрут на карте...`, 'success');
            buildRoute(current);
        }, function () {
            setLocationMessage('Не удалось получить местоположение. Проверьте разрешение браузера.', 'warning');
        }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 });
    });

    document.getElementById('speakLocationBtn').addEventListener('click', function () {
        if (!window.speechSynthesis) {
            setLocationMessage('Озвучивание адреса не поддерживается этим браузером.', 'warning');
            return;
        }
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Наш адрес: ${address}`));
    });

    document.getElementById('shareLocationBtn').addEventListener('click', async function () {
        const shareText = `Продуктовая доставка: ${address}, +375 (17) 123-45-67`;
        if (navigator.share) {
            await navigator.share({ title: 'Продуктовая доставка', text: shareText, url: window.location.href });
            return;
        }
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareText);
            setLocationMessage('Контакты скопированы в буфер обмена.', 'success');
        } else {
            setLocationMessage(shareText);
        }
    });

    document.documentElement.classList.add('about-reveal-ready');
    const revealItems = document.querySelectorAll('.about-tabs, .about-metrics, .about-section, .about-cta');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14, rootMargin: '0px 0px -70px 0px' });
        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }

    initMap();
});
