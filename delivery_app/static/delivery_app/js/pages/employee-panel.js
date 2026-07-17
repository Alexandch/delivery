const statusCounts=JSON.parse(document.getElementById('employee-status-counts').textContent);
if (window.Chart) {
  new Chart(document.getElementById('statusChart'),{type:'doughnut',data:{labels:Object.keys(statusCounts),datasets:[{data:Object.values(statusCounts),backgroundColor:['#f59e0b','#3b82f6','#22c55e','#ef4444'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{position:'bottom'}}}});
} else {
  document.querySelector('.chart-wrap').innerHTML='<p class="empty-row">Диаграмма недоступна без подключения библиотеки графиков.</p>';
}
