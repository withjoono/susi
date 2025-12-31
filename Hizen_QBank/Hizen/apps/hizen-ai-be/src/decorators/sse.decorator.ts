import { RequestMethod } from "@nestjs/common";
import { PATH_METADATA } from "@nestjs/common/constants";
import { METHOD_METADATA } from "@nestjs/common/constants";
import { SSE_METADATA } from "@nestjs/common/constants";

/**
 * Declares this route as a Server-Sent-Events endpoint
 */
export function Sse(props?: {
  path?: string;
  method?: RequestMethod;
}): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const path = props?.path && props.path.length ? props.path : "/";
    const method = props?.method ?? RequestMethod.GET;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata(SSE_METADATA, true, descriptor.value);
    return descriptor;
  };
}
