
export const dummyUser = [
    {id: 1, name: 'Kei Tsukishima', email: 'dummy@gmail.com', username: 'dummyuser', password: 'password', role: 'admin'},
    {id: 2, name: 'Steve Crafter', email: 'crafter@gmail.com', username: 'stevecraft', password: 'password', role: 'staff'},
];

export const adminSidemenuBtn = [
    {menu: 'Dashboard', path: '/admin-dashboard'},
    {menu: 'Inventory', path: '/inventory'},
    {menu: 'Transactions', path: '/transactions'},
    {menu: 'Reports / Analytics', path: '/reports'},
    {menu: 'User List', path: '/user-list'},
];

export const sampleOverview = [
    {category: 'Sales Revenue', value: '₱70,000.00', sub1: 'Last 30 Days', icon: 'src/assets/icons/sales-icon.png', path: "/reports"},
    {category: 'Total Orders', value: '350', sub1: 'Deliveries: 150', sub2: 'In Store: 200', icon: 'src/assets/icons/orders-icon.png', path: "/transactions"},
    {category: 'Inventory Level', value: 'In Stock', sub1: '5-Gallon Bottles', sub2: 'Stock: 50', icon: 'src/assets/icons/inventory-icon.png', path: "/inventory"},
    {category: 'Best Selling Product', value: '5-Gallon Refill', sub1: 'P50,000.00', sub2: 'Sold: 250', icon: 'src/assets/icons/products-icon.png', path: "/reports"},
];
