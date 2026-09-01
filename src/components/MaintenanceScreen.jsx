export default function MaintenanceScreen({ message }) {
  return (
    <div className="min-h-screen bg-ink text-ivory flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="kicker text-gold mb-4">Nilan Fashion</p>
        <h1 className="font-display text-3xl md:text-4xl mb-4">Our Website is Temporarily Unavailable</h1>
        <p className="text-ivory/60 text-sm">
          {message || "We're sorry for the inconvenience — we're updating things behind the scenes. Please check back shortly."}
        </p>
      </div>
    </div>
  );
}
