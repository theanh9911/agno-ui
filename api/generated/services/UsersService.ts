/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageResponse } from '../models/MessageResponse'
import type { PaginatedResponse_OSResponse_ } from '../models/PaginatedResponse_OSResponse_'
import type { SetCurrentOrganizationRequest } from '../models/SetCurrentOrganizationRequest'
import type { UpdateUserRoleRequest } from '../models/UpdateUserRoleRequest'
import type { UpdateUserRoleResponse } from '../models/UpdateUserRoleResponse'
import type { UserOrganization } from '../models/UserOrganization'
import type { UserProfileResponse } from '../models/UserProfileResponse'
import type { UserResponse } from '../models/UserResponse'
import type { UserUpdate } from '../models/UserUpdate'
import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'
export class UsersService {
  /**
   * Get Current User Profile
   * @returns UserProfileResponse Successful Response
   * @throws ApiError
   */
  public static usersGetCurrent(): CancelablePromise<UserProfileResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/me',
      errors: {
        401: `Authentication required`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Update Current User
   * Update current user profile
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static usersUpdateCurrent({
    requestBody
  }: {
    requestBody: UserUpdate
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/users/me',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        401: `Authentication required`,
        422: `Invalid user data`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Test Logging
   * Test endpoint to verify logging is working
   * @returns any Successful Response
   * @throws ApiError
   */
  public static testLoggingUsersTestLoggingGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/test-logging'
    })
  }
  /**
   * Get User Organizations
   * @returns UserOrganization Successful Response
   * @throws ApiError
   */
  public static usersGetOrganizations(): CancelablePromise<
    Array<UserOrganization>
  > {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/me/organizations'
    })
  }
  /**
   * Set Current Organization
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static usersSetCurrentOrganization({
    requestBody
  }: {
    requestBody: SetCurrentOrganizationRequest
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/users/me/current-organization',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        401: `Authentication required`,
        403: `Access to organization denied`,
        422: `Invalid organization ID`,
        500: `Internal server error`
      }
    })
  }
  /**
   * List All Users
   * List users in current organization (requires Owner role)
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static usersList({
    skip,
    limit = 100
  }: {
    skip?: number
    limit?: number
  }): CancelablePromise<Array<UserResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users',
      query: {
        skip: skip,
        limit: limit
      },
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * Get User By Id Endpoint
   * Get user by ID (requires authentication)
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static usersGetById({
    userId
  }: {
    userId: string
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/{user_id}',
      path: {
        user_id: userId
      },
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * Update User By Id
   * Update user by ID (requires Owner role in current organization)
   * @returns UserResponse Successful Response
   * @throws ApiError
   */
  public static userUpdateById({
    userId,
    requestBody
  }: {
    userId: string
    requestBody: UserUpdate
  }): CancelablePromise<UserResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/users/{user_id}',
      path: {
        user_id: userId
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        401: `Authentication required`,
        403: `Not authorized to update this user`,
        404: `User not found`,
        422: `Invalid user data`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Remove User From Organization
   * Remove user from organization (requires Owner role in current organization)
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static userRemoveFromOrganization({
    userId,
    organizationId
  }: {
    userId: string
    organizationId: string
  }): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/users/{user_id}/organizations/{organization_id}',
      path: {
        user_id: userId,
        organization_id: organizationId
      },
      errors: {
        401: `Authentication required`,
        403: `Only users with Owner role can remove users`,
        404: `User or organization not found`,
        422: `Validation Error`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Update User Organization Role
   * Update user's role in organization (requires Owner role in current organization)
   * @returns UpdateUserRoleResponse Successful Response
   * @throws ApiError
   */
  public static userUpdateOrganizationRole({
    userId,
    organizationId,
    requestBody
  }: {
    userId: string
    organizationId: string
    requestBody: UpdateUserRoleRequest
  }): CancelablePromise<UpdateUserRoleResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/users/{user_id}/organizations/{organization_id}/role',
      path: {
        user_id: userId,
        organization_id: organizationId
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        401: `Authentication required`,
        403: `Only users with Owner role can update roles`,
        404: `User or organization not found`,
        422: `Invalid role`,
        500: `Internal server error`
      }
    })
  }
  /**
   * List User Operating Systems
   * List operating systems across user's organizations
   * @returns PaginatedResponse_OSResponse_ Successful Response
   * @throws ApiError
   */
  public static usersListOperatingSystems({
    organizationId,
    isActive,
    limit = 20,
    offset
  }: {
    /**
     * Filter by organization ID
     */
    organizationId?: string | null
    /**
     * Filter by active status
     */
    isActive?: boolean | null
    /**
     * Items per page
     */
    limit?: number
    /**
     * Items to skip
     */
    offset?: number
  }): CancelablePromise<PaginatedResponse_OSResponse_> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/me/operating-systems',
      query: {
        organization_id: organizationId,
        is_active: isActive,
        limit: limit,
        offset: offset
      },
      errors: {
        422: `Validation Error`
      }
    })
  }
}
