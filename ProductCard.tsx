'use client';
import Link from "next/link";
import {Heart,ShoppingCart} from "lucide-react";
import type {Product} from "../lib/store";

export default function ProductCard({p}:{p:Product}){
 function add(){
  const cart=JSON.parse(localStorage.getItem("nesta-cart")||"[]") as {id:string,qty:number}[];
  const found=cart.find(x=>x.id===p.id); if(found) found.qty++; else cart.push({id:p.id,qty:1});
  localStorage.setItem("nesta-cart",JSON.stringify(cart));
  localStorage.setItem("nesta-cart-count",String(cart.reduce((s,x)=>s+x.qty,0)));
  window.dispatchEvent(new Event("nesta-cart"));
 }
 return <article className="product"><button className="wish" aria-label="Wishlist"><Heart size={18}/></button>
 <Link href={"/product/"+p.id}><div className="product-img">{p.emoji}</div></Link>
 <div className="product-info"><Link href={"/product/"+p.id}><h3>{p.name}</h3></Link>
 <p className="price">₵{p.price.toFixed(2)}</p><div className="rating">★★★★★ <span>({p.rating})</span></div>
 <button className="cart" onClick={add}><ShoppingCart size={15}/> Add to Cart</button></div></article>;
}
