/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingPortalResponse } from '../models/BillingPortalResponse'
import type { BillingStatusResponse } from '../models/BillingStatusResponse'
import type { CancellationResponse } from '../models/CancellationResponse'
import type { CheckoutRequest } from '../models/CheckoutRequest'
import type { CheckoutResponse } from '../models/CheckoutResponse'
import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'
export class BillingService {
  /**
   * Get Billing Dashboard
   * Get billing dashboard for current organization.
   * @returns BillingStatusResponse Successful Response
   * @throws ApiError
   */
  public static orgBillingDashboard(): CancelablePromise<BillingStatusResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/org/billing/',
      errors: {
        401: `Authentication required`,
        403: `Insufficient permissions`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Create Billing Portal Session
   * Create customer portal session.
   * @returns BillingPortalResponse Successful Response
   * @throws ApiError
   */
  public static orgBillingPortal({
    returnUrl
  }: {
    /**
     * URL to return to after billing portal
     */
    returnUrl: string
  }): CancelablePromise<BillingPortalResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/org/billing/portal',
      query: {
        return_url: returnUrl
      },
      errors: {
        401: `Authentication required`,
        403: `Insufficient permissions`,
        404: `No billing customer found`,
        422: `Validation Error`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Create Checkout Session
   * Create checkout session for product purchase.
   * @returns CheckoutResponse Successful Response
   * @throws ApiError
   */
  public static orgBillingCheckout({
    requestBody
  }: {
    requestBody: CheckoutRequest
  }): CancelablePromise<CheckoutResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/org/billing/checkout',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        401: `Authentication required`,
        403: `Insufficient permissions`,
        422: `Validation Error`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Cancel Subscription
   * Cancel the organization's subscription.
   *
   * By default, cancels at the end of the billing period. Set immediate=true to cancel
   * immediately and process any prorated refunds.
   * @returns CancellationResponse Successful Response
   * @throws ApiError
   */
  public static orgBillingCancel({
    immediate = false
  }: {
    /**
     * Cancel immediately instead of at period end
     */
    immediate?: boolean
  }): CancelablePromise<CancellationResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/org/billing/cancel',
      query: {
        immediate: immediate
      },
      errors: {
        401: `Authentication required`,
        403: `Insufficient permissions`,
        404: `No active subscription found`,
        422: `Validation Error`,
        500: `Internal server error`
      }
    })
  }
}
