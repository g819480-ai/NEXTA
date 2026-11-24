import Link from "next/link";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import {products,categories} from "../lib/store";

export default function Home(){return <main><Header/>
<section className="hero"><div className="hero-copy"><div className="eyebrow">WELCOME TO NESTA</div><h1>Your Style.<br/><strong>Your Choice.</strong></h1><p>Fashion, tech and everyday essentials — all in one place.</p><Link className="primary" href="/shop">Shop Now →</Link></div><div className="hero-note">Ghana's <em>fresh</em> online store.</div></section>
<section className="section"><div className="section-head"><h2>Shop by Category</h2><Link href="/shop">View all →</Link></div><div className="categories">{categories.map((c,i)=><Link className="category" href={"/shop?category="+encodeURIComponent(c)} key={c}><div className="category-img">{["👕","👟","👜","🎧","🧢","🏠","✨"][i]}</div><strong>{c}</strong></Link>)}</div></section>
<section className="section"><div className="section-head"><h2>New Arrivals</h2><Link href="/shop">Shop all →</Link></div><div className="products">{products.slice(0,5).map(p=><ProductCard p={p} key={p.id}/>)}</div></section>
<section className="deals"><div>🔥</div><div><small>NESTA DEALS</small><h2>UP TO 30% OFF</h2></div><div className="off">Selected items <strong>30%</strong></div><Link className="primary" href="/shop?deal=1">Shop Deals</Link></section>
<section className="benefits"><h2>Shop NESTA with <span>confidence.</span></h2><div className="benefit">🚚<section><b>Ghana Delivery</b><span>Across the country</span></section></div><div className="benefit">🔒<section><b>Secure Shopping</b><span>Safe checkout</span></section></div><div className="benefit">↩️<section><b>Easy Returns</b><span>Simple process</span></section></div><div className="benefit">💬<section><b>Support</b><span>We're here to help</span></section></div></section>
<footer><b>NESTA</b><span>Your Style. Your Choice.</span><span>© 2026 NESTA. All rights reserved.</span></footer></main>}
