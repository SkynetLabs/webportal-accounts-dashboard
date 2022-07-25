import PropTypes from "prop-types";

import { localizeMoney } from "../../lib/util";

export const PriceInfo = ({ amount, currency, discount }) => {
  const regularPrice = localizeMoney(amount / 100, currency);

  if (!discount) {
    return (
      <div>
        <strong>{regularPrice}</strong>
      </div>
    );
  }
  const { amountOff, duration, durationInMonths, percentOff } = discount;

  const discountPrice = amountOff ? amount - amountOff : amount * (percentOff / 100);

  return (
    <div>
      <div>
        <strong>{localizeMoney(discountPrice / 100)}</strong>
      </div>
      <div className="text-sm">
        {duration === "repeating" &&
          `for the first ${durationInMonths} ${durationInMonths > 1 ? "months" : "month"}, then ${regularPrice}`}
        {duration === "once" && `for the first month, then ${regularPrice}`}
        {duration === "forever" && "forever"}
      </div>
    </div>
  );
};

PriceInfo.propTypes = {
  /**
   * Regular price
   */
  amount: PropTypes.number.isRequired,
  /**
   * Regular price's currency
   */
  currency: PropTypes.string.isRequired,
  /**
   * Information about the discount applied (if any)
   */
  discount: PropTypes.shape({
    /**
     * Amount off of the regular price. Only set if percentOff is 0.
     */
    amountOff: PropTypes.number,
    /**
     * Percentage off of the regular price. Only  set if amountOff is 0.
     */
    percentOff: PropTypes.number,
    /**
     * Currency of the discount (used with amountOff)
     */
    currency: PropTypes.string,
    /**
     * Duration of the discount.
     */
    duration: PropTypes.oneOf(["once", "forever", "repeating"]),
    /**
     * Duration of the discount (set only if duration is "repeating").
     */
    durationInMonths: PropTypes.number,
  }),
};
