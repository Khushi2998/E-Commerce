import {useEffect,useState} from 'react';
import api from "../api/api";
import {useParams} from "react-router-dom";
import downloadInvoice from '../auth/downloadInvoice';

const Invoice=()=>{
    const {id} = useParams();
    const [invoice,setInvoice]=useState(null);
    
useEffect(()=> {
    api.get(`/invoice/${id}`).then(res=>setInvoice(res.data));
},[id]);

if (!invoice) return <p>Loading...</p>;

return (
    <div className='invoice'>
        <h2>Invoice #{invoice.invoiceNumber}</h2>
        <p>Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</p>

        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {invoice.items.map((item,i)=>(
                    <tr key={i}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                        <td>{item.price * item.quantity}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <h3>Subtotal: ₹{invoice.subTotal}</h3>
        <h3>Tax: ₹{invoice.tax}</h3>
        <h2>Total: ₹{invoice.total}</h2>

        <button onClick={downloadInvoice} className='download-btn'>
            Download Invoice PDF
        </button>
    </div>
);
};
export default Invoice;