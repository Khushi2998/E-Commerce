import {useEffect,useState} from 'react';
import api from "../api/api";
import {useParams} from "react-router-dom";
import downloadInvoice from '../auth/downloadInvoice';

const Invoice=()=>{
    const {id} = useParams();
    const [invoice,setInvoice]=useState(null);
    const [loading, setLoading] = useState(true);
    
useEffect(()=> {
    api.get(`/invoice/order/${id}`).then(res=>{setInvoice(res.data);setLoading(false);})
    .catch(err => { alert("Invoice not found");setLoading(false);});
},[id]);

if (loading) return <p>Loading invoice...</p>;
if (!invoice) return <p>Invoice not available</p>;

return (
    <div className='invoice'>
        <div id="invoice-print" className='invoice-page'>
        <header className="invoice-header">
        <h1>Infinity Store</h1>
        <p>Tax Invoice</p>
        </header>
        <section className="invoice-meta">
    <div>
        <strong>Invoice:</strong> {invoice.invoiceNumber}
    </div>
    <div>
      <strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}
    </div>
  </section>

        <table className="invoice-table">
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

      <section className="invoice-totals">
        <p>Subtotal: ₹{invoice.subTotal}</p>
        <p>Tax: ₹{invoice.tax}</p>
        <h3>Total: ₹{invoice.total}</h3>
     </section>

     <div className="pdf-footer">
        This is a computer generated invoice.
      </div>
</div>
        <button onClick={() => downloadInvoice(id)} className='btn'>
            Download Invoice PDF
        </button>
    </div>
);
};
export default Invoice;