/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingPortalResponse } from '../models/BillingPortalResponse'
import type { BillingStatusResponse } from '../models/BillingStatusResponse'
import type { CancellationResponse } from '../models/CancellationResponse'
import type { CheckoutRequest } from '../models/CheckoutRequest'
import type { CheckoutResponse } from '../models/CheckoutResponse'
import type { MessageResponse } from '../models/MessageResponse'
import type { OrganizationCreateRequest } from '../models/OrganizationCreateRequest'
import type { OrganizationInvitationCreateRequest } from '../models/OrganizationInvitationCreateRequest'
import type { OrganizationInvitationResponse } from '../models/OrganizationInvitationResponse'
import type { OrganizationMembershipCreateRequest } from '../models/OrganizationMembershipCreateRequest'
import type { OrganizationMembershipResponse } from '../models/OrganizationMembershipResponse'
import type { OrganizationResponse } from '../models/OrganizationResponse'
import type { OrganizationUpdateRequest } from '../models/OrganizationUpdateRequest'
import type { PaginatedResponse_OrganizationInvitationResponse_ } from '../models/PaginatedResponse_OrganizationInvitationResponse_'
import type { PaginatedResponse_OrganizationMembershipResponse_ } from '../models/PaginatedResponse_OrganizationMembershipResponse_'
import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'
export class OrganizationContextService {
  /**
   * Get Current Organization
   * Get current organization details.
   * @returns OrganizationResponse Successful Response
   * @throws ApiError
   */
  public static orgGetCurrent(): CancelablePromise<OrganizationResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/org/'
    })
  }
  /**
   * Create Organization
   * Create a new organization in WorkOS.
   * @returns OrganizationResponse Successful Response
   * @throws ApiError
   */
  public static orgCreate({
    requestBody
  }: {
    requestBody: OrganizationCreateRequest
  }): CancelablePromise<OrganizationResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/org/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * Delete Current Organization
   * Delete current organization.
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static orgDeleteCurrent(): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/org/'
    })
  }
  /**
   * Update Current Organization
   * Update current organization.
   * @returns OrganizationResponse Successful Response
   * @throws ApiError
   */
  public static orgUpdateCurrent({
    requestBody
  }: {
    requestBody: OrganizationUpdateRequest
  }): CancelablePromise<OrganizationResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/org/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * List Organization Memberships
   * List organization memberships.
   * @returns PaginatedResponse_OrganizationMembershipResponse_ Successful Response
   * @throws ApiError
   */
  public static orgListMemberships({
    userId,
    statuses,
    before,
    after,
    limit = 10
  }: {
    /**
     * Filter by user ID
     */
    userId?: string | null
    /**
     * Filter by statuses
     */
    statuses?: Array<'active' | 'inactive' | 'pending'> | null
    /**
     * Pagination cursor
     */
    before?: string | null
    /**
     * Pagination cursor
     */
    after?: string | null
    /**
     * Number of results per page
     */
    limit?: number
  }): CancelablePromise<PaginatedResponse_OrganizationMembershipResponse_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/org/memberships',
      query: {
        user_id: userId,
        statuses: statuses,
        before: before,
        after: after,
        limit: limit
      },
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * Create Organization Membership
   * Create organization membership.
   * @returns OrganizationMembershipResponse Successful Response
   * @throws ApiError
   */
  public static orgCreateMembership({
    requestBody
  }: {
    requestBody: OrganizationMembershipCreateRequest
  }): CancelablePromise<OrganizationMembershipResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/org/memberships',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * List Organization Invitations
   * List organization invitations.
   * @returns PaginatedResponse_OrganizationInvitationResponse_ Successful Response
   * @throws ApiError
   */
  public static orgListInvitations({
    email,
    invitationState,
    before,
    after,
    limit = 10
  }: {
    /**
     * Filter by email address
     */
    email?: string | null
    /**
     * Filter by invitation state (pending, accepted, expired, revoked)
     */
    invitationState?: string | null
    /**
     * Pagination cursor
     */
    before?: string | null
    /**
     * Pagination cursor
     */
    after?: string | null
    /**
     * Number of results per page
     */
    limit?: number
  }): CancelablePromise<PaginatedResponse_OrganizationInvitationResponse_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/org/invitations',
      query: {
        email: email,
        invitation_state: invitationState,
        before: before,
        after: after,
        limit: limit
      },
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * Create Organization Invitation
   * Create organization invitation.
   * @returns OrganizationInvitationResponse Successful Response
   * @throws ApiError
   */
  public static orgCreateInvitation({
    requestBody
  }: {
    requestBody: OrganizationInvitationCreateRequest
  }): CancelablePromise<OrganizationInvitationResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/org/invitations',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * Revoke Organization Invitation
   * Revoke organization invitation.
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static orgRevokeInvitation({
    invitationId
  }: {
    invitationId: string
  }): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/org/invitations/{invitation_id}',
      path: {
        invitation_id: invitationId
      },
      errors: {
        422: `Validation Error`
      }
    })
  }
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
