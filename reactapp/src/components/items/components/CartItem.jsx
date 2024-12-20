import React from 'react';
import { get as _get } from 'lodash-es';
import { bool, func, shape, string } from 'prop-types';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

import Button from '../../common/Button';
import TextInput from '../../common/Form/TextInput';
import { __ } from '../../../i18n';
import { _emptyFunc } from '../../../utils';
import { CART_ITEMS_FORM } from '../../../config';
import useItemsFormContext from '../hooks/useItemsFormContext';

function CartItem({ item, isLastItem, actions }) {
  const { formikData, handleKeyDown, cartItemsTouched, itemUpdateHandler } =
    useItemsFormContext();
  const qtyField = `${item.id}_qty`;
  const itemQtyField = `${CART_ITEMS_FORM}.${qtyField}`;
  const isQtyFieldTouched = _get(cartItemsTouched, qtyField);

  return (
    <tr
      className={`border-2 md:border-0 font-gotham ${
        isLastItem ? '' : 'md:border-b-2'
      }`}
    >
      {/** DESKTOP TD ELEMENTS */}
      <td className="hidden md:table-cell">
        <div className="relative py-6">
          {item.rowDiscountPercentage > 0 && (
            <div className="absolute top-6 left-0 bg-customOrange text-white px-[5.5px] py-[3px] text-xs font-book">
              {item.rowDiscountPercentage}% OFF
            </div>
          )}
          <img
            className="w-[100px] h-auto"
            alt={item.productSku}
            src={item.productSmallImgUrl}
          />
          {/* <div className="text-xs">
            <div>{item.productName}</div>
            {item.isConfigurable ? (
              <ul className="flex flex-wrap space-x-3 text-gray-400">
                {item.selectedConfigOptions.map((configOption) => (
                  <li key={configOption.optionId}>{configOption.label}</li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-1 text-gray-400">
                <li>{`SKU: ${item.productSku}`}</li>
              </ul>
            )}
          </div> */}
        </div>
      </td>
      <td className="hidden md:table-cell pl-3">
        {/* <TextInput
          min="0"
          width="w-20"
          type="number"
          name={itemQtyField}
          formikData={formikData}
          onKeyDown={handleKeyDown}
          id={`${itemQtyField}-desktop`}
          onChange={actions.handleQtyUpdate}
        /> */}
        <p className="text-lg pt-25">{item.productName}</p>
        <p className="text-sm pt-6">Qty: {item.quantity}</p>
        <div className="text-sm pt-3 flex gap-2">
          <p
            className={`hidden md:table-cell ${
              item.rowSpecialPriceAmount < item.rowRegularPriceAmount
                ? 'line-through text-gray-500'
                : 'font-book'
            }`}
          >
            {item.rowRegularPrice}
          </p>
          {item.rowSpecialPriceAmount &&
            item.rowSpecialPriceAmount < item.rowRegularPriceAmount && (
              <p className="xl:table-cell font-book">{item.rowSpecialPrice}</p>
            )}
        </div>
      </td>

      {/* <td className="hidden md:table-cell">
        <Button
          size="sm"
          variant="secondary"
          click={itemUpdateHandler}
          disable={!isQtyFieldTouched}
        >
          <ArrowPathIcon className="w-5 h-5 text-black" />
          <span className="sr-only">{__('Update')}</span>
        </Button>
      </td> */}

      {/** MOBILE TD ELEMENTS */}
      <td className="px-2 py-2 md:hidden">
        <table className="w-full">
          <tbody>
            <tr className="">
              <td>
                <table className="text-xs">
                  <tbody>
                    <tr className="border-b">
                      <th className="px-2 py-2">{__('Name')}</th>
                      <td className="pl-1 text-sm">
                        <div className="flex items-center py-1">
                          <img
                            className="w-8 h-8"
                            alt={item.productSku}
                            src={item.productSmallImgUrl}
                          />
                          <div className="pl-2 space-y-2">
                            <div>{item.productName}</div>
                            {item.isConfigurable ? (
                              <ul className="flex flex-wrap space-x-3 text-xs text-gray-400">
                                {item.selectedConfigOptions.map(
                                  (configOption) => (
                                    <li key={configOption.optionId}>
                                      {configOption.label}
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <ul className="space-y-1 text-gray-400">
                                <li>{`SKU: ${item.productSku}`}</li>
                              </ul>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-2 py-2">{__('SKU')}</th>
                      <td className="pl-2 text-sm">{item.productSku}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-2 py-2">{__('Price')}</th>
                      <td className="pl-2 text-sm">{item.price}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="px-2 py-2">{__('Qty')}</th>
                      <td className="px-1 pb-2">
                        <div className="flex items-center justify-between">
                          <TextInput
                            min="0"
                            type="number"
                            className="w-20"
                            name={itemQtyField}
                            formikData={formikData}
                            onKeyDown={handleKeyDown}
                            id={`${itemQtyField}-mobile`}
                            onChange={actions.handleQtyUpdate}
                          />
                          <div className="mt-2 ml-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              click={itemUpdateHandler}
                              disable={!isQtyFieldTouched}
                            >
                              <ArrowPathIcon className="w-5 h-5 text-black" />
                              <span className="sr-only">{__('Update')}</span>
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th className="px-2 py-2 text-base">{__('Subtotal')}</th>
                      <td className="pl-2 text-base text-right">
                        {item.rowTotal}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

CartItem.propTypes = {
  item: shape({
    id: string,
  }).isRequired,
  isLastItem: bool,
  actions: shape({ handleQtyUpdate: func }),
};

CartItem.defaultProps = {
  isLastItem: false,
  actions: { handleQtyUpdate: _emptyFunc() },
};

export default CartItem;
