import Header from "../layouts/Header";
import AdminSidemenu from "../layouts/AdminSidemenu";
import Breadcrumb from "../components/Breadcrumb";
import SalesTable from "../components/SalesTable";
import { useAuth } from "../contexts/AuthContext";
import StaffSidemenu from "../layouts/StaffSidemenu";


const AdminSales = () => {
    const { user } = useAuth();

    const sales = [
        {
            id: 1,
            customer: "Walk in",
            product: "5-Gallon Bottle",
            quantity: 2,
            unitPrice: 50,
            subtotal: 100,
            dateTime: "2023-10-01 10:30 AM"
        },
        {
            id: 2,
            customer: "Tagoloan Community College",
            product: "3-Gallon Bottle",
            quantity: 3,
            unitPrice: 30,
            subtotal: 90,
            dateTime: "2023-10-02 11:15 AM"
        },
        {
            id: 3,
            customer: "St. Paul Hospital",
            product: "1-Gallon Bottle",
            quantity: 5,
            unitPrice: 10,
            subtotal: 50,
            dateTime: "2023-10-03 09:45 AM"
        },
        {
            id: 4,
            customer: "Kaking Tagoloan",
            product: "5-Gallon Bottle",
            quantity: 1,
            unitPrice: 50,
            subtotal: 50,
            dateTime: "2023-10-04 02:00 PM"
        },
        {
            id: 5,
            customer: "Mr. DIY Tagoloan",
            product: "3-Gallon Bottle",
            quantity: 4,
            unitPrice: 30,
            subtotal: 120,
            dateTime: "2023-10-05 04:20 PM"
        },
        {
            id: 6,
            customer: "Walk in",
            product: "3-Gallon Bottle",
            quantity: 4,
            unitPrice: 30,
            subtotal: 120,
            dateTime: "2023-10-05 04:20 PM"
        },
        {
            id: 7,
            customer: "Katipunan Bank",
            product: "3-Gallon Bottle",
            quantity: 4,
            unitPrice: 30,
            subtotal: 120,
            dateTime: "2023-10-05 04:20 PM"
        },
        {
            id: 8,
            customer: "Tagoloan Municipal Hall",
            product: "3-Gallon Bottle",
            quantity: 4,
            unitPrice: 30,
            subtotal: 120,
            dateTime: "2023-10-05 04:20 PM"
        },
        {
            id: 9,
            customer: "Walk in",
            product: "3-Gallon Bottle",
            quantity: 4,
            unitPrice: 30,
            subtotal: 120,
            dateTime: "2023-10-05 04:20 PM"
        },
        {
            id: 10,
            customer: "Walk in",
            product: "3-Gallon Bottle",
            quantity: 4,
            unitPrice: 30,
            subtotal: 120,
            dateTime: "2023-10-05 04:20 PM"
        },
        {
            id: 11,
            customer: "Walk in",
            product: "3-Gallon Bottle",
            quantity: 4,
            unitPrice: 30,
            subtotal: 120,
            dateTime: "2023-10-05 04:20 PM"
        },
        {
            id: 12,
            customer: "Botoy's Tagoloan",
            product: "3-Gallon Bottle",
            quantity: 4,
            unitPrice: 30,
            subtotal: 120,
            dateTime: "2023-10-05 04:20 PM"
        }
    ];


    const products = [
        {id: 1, name: "5-Gallon Bottle"},
        {id: 2, name: "3-Gallon Bottle"},
        {id: 3, name: "500ml Bottle"},
        {id: 4, name: "1-Gallon Bottle"},
    ];
    

    return (
        <div className="h-full w-full scroll-smooth">
            <Header />
            <div className="flex h-full w-full fixed top-15">
                {user?.role == "admin" ? (
                    <AdminSidemenu />
                ) : (
                    <StaffSidemenu />
                )}
                <div className="h-full w-full ml-3 mt-2 mr-2 rounded-md">
                    <Breadcrumb />
                    <div className="h-full w-full bg-white mt-2 rounded-md p-5">
                        <SalesTable sales={sales} products={products} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSales;
