import type { StoreSettings } from "@/content/store";

/**
 * Care and delivery: the store prose from settings set out as quiet columns,
 * delivery and returns together, then care, then viewings. The settings
 * getter never returns empty, so this section always reads when its toggle
 * allows it.
 */
export default function CareDelivery({
  settings,
}: {
  settings: StoreSettings;
}) {
  return (
    <section className="section-rule reveal" aria-labelledby="care-title">
      <h2 id="care-title" className="store-head">
        Care and delivery
      </h2>
      <div className="care-grid">
        <div className="care-cell">
          <h3 className="mono">Delivery and returns</h3>
          <p>{settings.deliveryProse}</p>
          <p>{settings.returnsProse}</p>
        </div>
        <div className="care-cell">
          <h3 className="mono">Care</h3>
          <p>{settings.careProse}</p>
        </div>
        <div className="care-cell">
          <h3 className="mono">Viewings</h3>
          <p>{settings.viewingProse}</p>
        </div>
      </div>
    </section>
  );
}
