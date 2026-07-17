document.addEventListener('DOMContentLoaded', () => {
    const method = document.getElementById('delivery_method');
    const pickup = document.getElementById('pickup_point_div');
    const address = document.getElementById('delivery_address_div');
    const pickupSelect = document.getElementById('pickup_point');
    const addressInput = document.getElementById('delivery_address');
    const syncDeliveryFields = () => {
        const isPickup = method.value === 'pickup';
        pickup.hidden = !isPickup;
        address.hidden = isPickup;
        pickupSelect.required = isPickup;
        addressInput.required = !isPickup;
    };
    method.addEventListener('change', syncDeliveryFields);
    syncDeliveryFields();
});
