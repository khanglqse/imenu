import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType()
export class VendorProduct {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  vendorId?: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  categories?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  price: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => [Addon], { nullable: true })
  addons?: Addon[];
}


@ObjectType()
export class Addon {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
  
  @Field(() => Int)
  price: number;

  @Field({ nullable: true })
  categories?: string;

  @Field({ nullable: true })
  description?: string;
}