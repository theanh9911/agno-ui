/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageResponse } from '../models/MessageResponse'
import type { OSCreateRequest } from '../models/OSCreateRequest'
import type { OSResponse } from '../models/OSResponse'
import type { OSUpdateRequest } from '../models/OSUpdateRequest'
import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'
export class OperatingSystemsService {
  /**
   * List Organization Operating Systems
   * List operating systems for current organization
   * @returns OSResponse Successful Response
   * @throws ApiError
   */
  public static operatingSystemsList(): CancelablePromise<Array<OSResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/operating-systems/',
      errors: {
        401: `Authentication required`,
        403: `Insufficient permissions`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Create Organization Operating System
   * Create a new operating system for current organization
   * @returns OSResponse Successful Response
   * @throws ApiError
   */
  public static operatingSystemsCreate({
    requestBody
  }: {
    requestBody: OSCreateRequest
  }): CancelablePromise<OSResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/operating-systems/',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        401: `Authentication required`,
        403: `Insufficient permissions or remote endpoint not allowed`,
        422: `Invalid operating system data`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Get Organization Operating System
   * Get a specific operating system
   * @returns OSResponse Successful Response
   * @throws ApiError
   */
  public static operatingSystemsGet({
    osId
  }: {
    osId: string
  }): CancelablePromise<OSResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/operating-systems/{os_id}',
      path: {
        os_id: osId
      },
      errors: {
        401: `Authentication required`,
        403: `Insufficient permissions`,
        404: `Operating system not found`,
        422: `Validation Error`,
        500: `Internal server error`
      }
    })
  }
  /**
   * Update Organization Operating System
   * Update an operating system
   * @returns OSResponse Successful Response
   * @throws ApiError
   */
  public static operatingSystemsUpdate({
    osId,
    requestBody
  }: {
    osId: string
    requestBody: OSUpdateRequest
  }): CancelablePromise<OSResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/operating-systems/{os_id}',
      path: {
        os_id: osId
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`
      }
    })
  }
  /**
   * Delete Organization Operating System
   * Delete an operating system
   * @returns MessageResponse Successful Response
   * @throws ApiError
   */
  public static operatingSystemsDelete({
    osId
  }: {
    osId: string
  }): CancelablePromise<MessageResponse> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/operating-systems/{os_id}',
      path: {
        os_id: osId
      },
      errors: {
        401: `Authentication required`,
        403: `Insufficient permissions`,
        404: `Operating system not found`,
        422: `Validation Error`,
        500: `Internal server error`
      }
    })
  }
}
