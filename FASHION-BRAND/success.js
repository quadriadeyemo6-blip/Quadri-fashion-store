const delivery = JSON.parse(localStorage.getItem("deliveryDetails"));

if (delivery) {
  document.getElementById("delivery-info").innerHTML = `
    <h4>Delivery Information</h4>
    <p><strong>Name:</strong> ${delivery.name}</p>
    <p><strong>Phone:</strong> ${delivery.phone}</p>
    <p><strong>Address:</strong> ${delivery.address}</p>
    <p><strong>City:</strong> ${delivery.city}</p>
    <p><strong>State:</strong> ${delivery.state}</p>
    ${delivery.note ? `<p><strong>Note:</strong> ${delivery.note}</p>` : ""}
  `;
}
