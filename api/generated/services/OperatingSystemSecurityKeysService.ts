/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageResponse } from '../models/MessageResponse'
import type { SecurityKeyCreateRequest } from '../models/SecurityKeyCreateRequest'
import type { SecurityKeyListResponse } from '../models/SecurityKeyListResponse'
import type { SecurityKeyResponse } from '../models/SecurityKeyResponse'
import type { SecurityKeyUpdateRequest } from '../models/SecurityKeyUpdateRequest'
import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'
export class OperatingSystemSecurityKeysService {
  /**
   * Create Security Key Endpoint
   * Create a new security key for an operating system (owner only).
   * @returns SecurityKeyResponse Successful Response
   * @throws ApiError
   */
  public static createSecurityKeyEndpointOperatingSystemsOsIdSecurityKeysPost({
    osId,
    requestBody
  }: {
    osId: string
    requestBody: SecurityKeyCreateRequest
  }): CancelablePromise<SecurityKeyResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/operating-systems/{os_id}/security-keys',
      path: {
        os_id: osId
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        403: `Forbidden`,
        404: `Not Found`,
        409: `Conflict`,
        422: `Validation Error`
      }
    })
  }
  /**
   * List Security Keys Endpoint
   * List security keys for a specific operating system.
   * @returns SecurityKeyListResponse Successful Response
   * @throws ApiError
   */
  public static listSecurityKeysEndpointOperatingSystemsOsIdSecurityKeysGet({
    osId
  }: {
    osId: string
  }): CancelablePromise<SecurityKeyListResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/operating-systems/{os_id}/security-keys',
      path: {
        os_id: osId
      },
      errors: {
        403: `Forbidden`,
        422: `Validation Error`
      }
    })
  }
  /**
   * Get Security Key Endpoint
   * Get a specific security key by ID.
   * @returns SecurityKeyResponse Successful Response
   * @throws ApiError
   */
  public static getSecurityKeyEndpointOperatingSystemsOsIdSecurityKeysSecurityKeyIdGet({
    osId,
    securityKeyId
  }: {
    osId: string
    securityKeyId: string
  }): CancelablePromise<SecurityKeyResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/operating-systems/{os_id}/security-keys/{security_key_id}',
      path: {
        os_id: osId,
        security_key_id: securityKeyId
      },
      errors: {
        403: `Forbidden`,
        404: `Not Found`,
        422: `Validation Error`
      }
    })
  }
  /**
   * Update Security Key Endpoint
   * Update a security key's name (owner only).
   * @returns SecurityKeyResponse Successful Response
   * @throws ApiError
   */
  public static updateSecurityKeyEndpointOperatingSystemsOsIdSecurityKeysSecurityKeyIdPatch({
    osId,
    securityKeyId,
    requestBody
  }: {
    osId: string
    securityKeyId: string
    requestBody: SecurityKeyUpdateRequest
  }): CancelablePromise<SecurityKeyResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/operating-systems/{os_id}/security-keys/{security_key_id}',
      path: {
        os_id: osId,
        security_key_id: securityKeyId
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        403: `Forbidden`,
        404: `Not Found`,
        422: `Validation Error`
      }
    })
  }
  /**
   * Delete Security Key Endpoint
   * Delete a security key (owner only, soft delete).
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static deleteSecurityKeyEndpointOperatingSystemsOsIdSecurityKeysSecurityKeyIdDelete({
    osId,
    securityKeyId
  }: {
    osId: string
    securityKeyId: string
  }): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/operating-systems/{os_id}/security-keys/{security_key_id}',
      path: {
        os_id: osId,
        security_key_id: securityKeyId
      },
      errors: {
        403: `Forbidden`,
        404: `Not Found`,
        422: `Validation Error`
      }
    })
  }
}
