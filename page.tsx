'use client';
import Header from "../../components/Header";
import {products} from "../../lib/store";
import {useEffect,useState} from "react";
import {Minus,Plus,Trash2,ShoppingBag} from "lucide-react";
export default function Cart(){
 const [cart,setCart]=useState<{id:string,qty:number,size?:string}[]>([]);
 useEffect(()=>setCart(JSON.parse(localStorage.getItem("nesta-cart")||"[]")),[]);
 const rows=cart.map(x=>({...x,p:products.find(p=>p.id===x.id)})).filter(x=>x.p);
 const subtotal=rows.reduce((s,x)=>s+(x.p!.price*x.qty),0);
 function save(next:typeof cart){setCart(next);localStorage.setItem("nesta-cart",JSON.stringify(next));localStorage.setItem("nesta-cart-count",String(next.reduce((s,x)=>s+x.qty,0)));window.dispatchEvent(new Event("nesta-cart"))}
 return <main><Header/><div className="cart-wrap"><div className="eyebrow">YOUR SHOPPING BAG</div><h1>Cart</h1>{!rows.length?<div className="empty"><ShoppingBag size={42}/><h2>Your cart is empty</h2><a className="primary" href="/shop">Continue Shopping</a></div>:<div className="cart-grid"><section>{rows.map(x=><div className="cart-row" key={x.id+x.size}><div className="mini">{x.p!.emoji}</div><div className="cart-name"><b>{x.p!.name}</b><span>{x.p!.category}{x.size?` · Size ${x.size}`:""}</span></div><div className="line-price">₵{x.p!.price.toFixed(2)}</div><div className="qty"><button onClick={()=>save(cart.map(c=>c===x?{...c,qty:Math.max(1,c.qty-1)}:c))}><Minus size={14}/></button><span>{x.qty}</span><button onClick={()=>save(cart.map(c=>c===x?{...c,qty:c.qty+1}:c))}><Plus size={14}/></button></div><button className="remove" onClick={()=>save(cart.filter(c=>c!==x))}><Trash2 size={17}/></button></div>)}</section><aside className="summary"><h2>Order Summary</h2><div><span>Subtotal</span><b>₵{subtotal.toFixed(2)}</b></div><div><span>Delivery</span><b>Calculated at checkout</b></div><hr/><div className="total"><span>Total</span><strong>₵{subtotal.toFixed(2)}</strong></div><button className="primary full">Checkout</button><a className="continue" href="/shop">← Continue Shopping</a></aside></div>}</div></main>
}
