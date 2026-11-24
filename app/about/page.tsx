import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="page">
      <div className="simple-page">
        <span className="eyebrow">ABOUT NESTA</span>

        <h1>Your Style. Your Choice.</h1>

        <p>
          NESTA is built to make online shopping simple, stylish and
          accessible. Discover products across fashion, footwear,
          accessories, electronics and more.
        </p>

        <p>
          We believe shopping should feel easy from the moment you
          discover a product to the moment it reaches your door.
        </p>

        <Link href="/shop" className="btn btn-primary">
          Shop NESTA
        </Link>
      </div>
    </div>
  );
}
