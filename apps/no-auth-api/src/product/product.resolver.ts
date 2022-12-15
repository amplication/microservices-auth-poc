import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import { ProductResolverBase } from "./base/product.resolver.base";
import { Product } from "./base/Product";
import { ProductService } from "./product.service";

@graphql.Resolver(() => Product)
export class ProductResolver extends ProductResolverBase {
  constructor(
    protected readonly service: ProductService,
  ) {
    super(service);
  }
}
