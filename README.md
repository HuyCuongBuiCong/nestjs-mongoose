# NestJS MongoDB

This guide provides a simple overview of setting up a NestJS application with MongoDB using the Mongoose module. It includes creating modules, services, schemas, and integrating Mongoose for database operations, illustrated with diagrams for clarity.

Full article can be found [https://kelvinbz.medium.com/exploring-a-nestjs-application-with-mongodb-using-mongoose-a-beginners-guide-5f7e357f97bd](https://kelvinbz.medium.com/exploring-a-nestjs-application-with-mongodb-using-mongoose-a-beginners-guide-5f7e357f97bd)

```mermaid
sequenceDiagram
    participant Client
    participant UsersController
    participant UserService
    participant UserModel

    Client->>UsersController: create(createUserDto)
    activate UsersController
    UsersController->>UserService: create(createUserDto)
    activate UserService
    UserService->>UserModel: new this.userModel(createUserDto);
    activate UserModel
    UserModel->>UserService: Returns saved UserDocument
    deactivate UserModel
    UserService->>UsersController: Returns created UserDocument
    deactivate UserService
    UsersController->>Client: Returns created UserDocument
    deactivate UsersController

    Client->>UsersController: findAll()
    activate UsersController
    UsersController->>UserService: findAll()
    activate UserService
    UserService->>UserModel: find().exec()
    activate UserModel
    UserModel->>UserService: Returns UserDocument[]
    deactivate UserModel
    UserService->>UsersController: Returns UserDocument[]
    deactivate UserService
    UsersController->>Client: Returns UserDocument[]
    deactivate UsersController
```


## Overview

### Code Structure
The following sections provide an overview of the structure and the setup for MongoDB integration.

```bash
.
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── config
│      └── database.config.ts
├── main.ts
└── users
    ├── dto
    │     └── create-user.dto.ts
    ├── schemas
    │      └── user.schema.ts
    ├── user.module.ts
    ├── users.controller.ts
    └── users.service.ts


```

```mermaid
graph LR
    A[Users Directory]
    A --> B[dto]
    B --> C[create-user.dto.ts: Defines the DTO for creating a user]

    A --> D[schemas]
    D --> E[user.schema.ts: Defines the Mongoose schema for the User model]

    A --> F[user.module.ts]
    F --> G[Imports MongooseModule.forFeature]
    F --> H[Organizes users' related components]

    A --> I[users.controller.ts: Handles incoming HTTP requests]
    I --> J[Uses UsersService to perform operations]

    A --> K[users.service.ts: Contains business logic for user operations]
    K --> L[Interacts with UserModel for database operations]

    classDef dto fill:#f9f,stroke:#333,stroke-width:2px;
    classDef schemas fill:#ff9,stroke:#333,stroke-width:2px;
    classDef module fill:#9f9,stroke:#333,stroke-width:2px;
    classDef controller fill:#9ff,stroke:#333,stroke-width:2px;
    classDef service fill:#f99,stroke:#333,stroke-width:2px;

    class B dto;
    class D schemas;
    class F module;
    class I controller;
    class K service;

    X[Config Directory]
    X --> Y[config/database.config.ts: Configuration file for database settings]

    Z[AppModule]
    Z --> AA[ConfigModule: Loads configuration from .env]
    Z --> AB[MongooseModule: Sets up MongoDB connection]
    Z --> AC[UsersModule: Manages user-related functionality]

    classDef config fill:#99f,stroke:#333,stroke-width:2px;
    classDef appmodule fill:#f99,stroke:#333,stroke-width:2px;

    class X config;
    class Z appmodule;

    Z --> A
    Z --> X

```

### Flow of interactions

Flow of interactions between the various components of the Users module and the MongoDB database using Mongoose

```mermaid
sequenceDiagram
    participant User
    participant UserSchema
    participant UserDocument
    participant MongooseModule as "MongooseModule.forFeature"
    participant UserModel
    participant UsersService
    participant UsersController
    participant Client

    User ->> UserSchema: "createForClass(User)"
    UserSchema ->> UserDocument: "HydratedDocument<User>"
    MongooseModule ->> UserSchema: "use user schema"
    MongooseModule ->> UserModel: "create model"
    
    note over MongooseModule, UserModel: "Dependency Injection: UserModel injected into UsersService"
    
    Client ->> UsersController: "create(createUserDto)"
    note over UsersController, UsersService: "Dependency Injection: UsersService injected into UsersController"
    
    UsersController ->> UsersService: "create(createUserDto)"
    UsersService ->> UserModel: "new User(createUserDto)"
    UserModel ->> UsersService: "createdUser"
    UsersService ->> UserModel: "save()"
    UserModel ->> UsersService: "createdUser"
    UsersService ->> UsersController: "createdUser"
    UsersController ->> Client: "createdUser"
    
    Client ->> UsersController: "findAll()"
    UsersController ->> UsersService: "findAll()"
    UsersService ->> UserModel: "find().exec()"
    UserModel ->> UsersService: "UserDocument[]"
    UsersService ->> UsersController: "UserDocument[]"
    UsersController ->> Client: "UserDocument[]"

```

```mermaid
graph TD
    Z[AppModule]
    Z --"Imports"--> A[UsersModule]
    Z --"Loads"--> B[ConfigModule]
    Z --"Sets up connection"--> C[MongooseModule]

    C --"Uses"--> G[ConfigService]

    A --"Contains"--> D[UsersController]
    A --"Contains"--> E[UsersService]
    A --"Defines"--> F[UserModel]

    D --"Depends on"--> E
    E --"Depends on"--> F

    classDef module fill:#9f9,stroke:#333,stroke-width:2px;
    classDef controller fill:#9ff,stroke:#333,stroke-width:2px;
    classDef service fill:#f99,stroke:#333,stroke-width:2px;
    classDef model fill:#ff9,stroke:#333,stroke-width:2px;
    classDef config fill:#99f,stroke:#333,stroke-width:2px;

    class Z module;
    class A module;
    class B config;
    class C module;
    class D controller;
    class E service;
    class F model;
    class G config;

```
### App Module

```mermaid
graph TD
  AppModule[AppModule]
  AppModule --"Imports"--> UsersModule[UsersModule]
AppModule --"Loads"--> ConfigModule[ConfigModule]
AppModule --"Sets up connection"--> MongooseModule[MongooseModule]

MongooseModule --"Uses"--> ConfigService[ConfigService]
MongooseModule --"forRootAsync"--> ConfigService



classDef module fill:#9f9,stroke:#333,stroke-width:2px;
classDef controller fill:#9ff,stroke:#333,stroke-width:2px;
classDef service fill:#f99,stroke:#333,stroke-width:2px;
classDef model fill:#ff9,stroke:#333,stroke-width:2px;
classDef config fill:#99f,stroke:#333,stroke-width:2px;

class AppModule module;
class UsersModule module;
class ConfigModule config;
class MongooseModule module;
class UsersController controller;
class UsersService service;
class UserModel model;
class ConfigService config;

```

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig, { CONFIG_DATABASE } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get(CONFIG_DATABASE).users.uri,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

The `AppModule` is the root module of your NestJS application. It imports and configures several modules:

- `ConfigModule`: Loads configuration from .env and is globally available.
- `MongooseModule`: Asynchronously sets up the MongoDB connection using configuration from ConfigModule.
- `UsersModule`: Manages user-related functionality

### Mongoose Module

**Dynamic modules** in NestJS provide an API for importing one module into another with customizable properties and behavior. Unlike static modules, dynamic modules allow you to pass configuration options at runtime, enabling the consuming module to influence how the imported module is set up. This flexibility is particularly useful for modules that require different configurations in different contexts, such as configuration modules that need to adapt to various environments (development, staging, production).

```mermaid
graph LR
  NestJS_Modules[Modules]

  NestJS_Modules --> Configuration[Configuration]
  Configuration --> Static_Config[Static Module: Fixed configuration]
  Configuration --> Dynamic_Config[Dynamic Module: Configurable at runtime]

  NestJS_Modules --> Import_Method[Import Method]
  Import_Method --> Static_Import[Static Module: Imported directly]
  Import_Method --> Dynamic_Import["Dynamic Module: Uses static method \n(e.g., register(), forRoot(), forFeature())"]

  NestJS_Modules --> Customization[Customization]
  Customization --> Static_Customization[Static Module: No customization]
  Customization --> Dynamic_Customization[Dynamic Module: Accepts options object]

  classDef default fill:#f3f4f6,stroke:#333,stroke-width:2px;
  classDef config fill:#ffcccc,stroke:#333,stroke-width:2px;
  classDef import fill:#ccffcc,stroke:#333,stroke-width:2px;
  classDef customization fill:#ccccff,stroke:#333,stroke-width:2px;
  classDef static fill:#ffffcc,stroke:#333,stroke-width:2px;
  classDef dynamic fill:#cceeff,stroke:#333,stroke-width:2px;

  class Configuration config;
  class Static_Config static;
  class Dynamic_Config dynamic;
  class Import_Method import;
  class Static_Import static;
  class Dynamic_Import dynamic;
  class Customization customization;
  class Static_Customization static;
  class Dynamic_Customization dynamic;

```

#### MongooseModule.forRoot:

- **Purpose**: Establishes a connection to your MongoDB database(s). It's responsible for:
  Specifying the connection URI (uniform resource identifier) of your MongoDB database.
  Setting up global Mongoose options (e.g., connection pool size, retry settings).
  Defining the connection name if you have multiple databases.
- **Location**: Typically placed in your root AppModule to ensure that the connection is available to the entire application.
- **Usage**: Called only once per connection.
- **Dynamic Configuration**: `forRootAsync` allows for the MongoDB connection to be configured dynamically at runtime, which is especially useful when the connection URI or other options depend on external sources like environment variables or a configuration service.
#### MongooseModule.forFeature:

- **Purpose**: Registers Mongoose schemas and creates models for specific feature modules. It does the following:
  Associates a schema with a model name.
  Provides the connection name where the model should be registered.
- **Location**: Used within feature modules (e.g., InsightModule, PatientModule, HealthModule) to define the models specific to that module.
- **Usage**: Called once per feature module, for each model you need to work with.

#### In summary:

- `MongooseModule.forRoot` sets up the database connection infrastructure.
- `MongooseModule.forFeature` defines the models you want to use within specific parts of your application (feature modules).
### Class Diagram

This class diagram shows the relationships between the AppModule, UsersModule, and the related services, controllers, and schemas.



```mermaid
classDiagram
    class AppModule {
        +constructor()
    }

    class UsersModule {
        +constructor()
    }

    class UsersController {
        -usersService: UsersService
        +create(createUserDto: CreateUserDto): User
        +findAll(): List~User~
    }

class UsersService {
-userModel: Model~User~
+create(createUserDto: CreateUserDto): Promise~User~
+findAll(): Promise~List~User~~
}

class User {
+name: string
+age: number
+save(): Promise~User~
}

class CreateUserDto {
+name: string
+age: number
}

class MongooseModule {
+forRoot(uri: string, options: Object): DynamicModule
+forFeature(models: Array~Object~): DynamicModule
}

AppModule --> MongooseModule: "Imports MongooseModule with forRoot"
UsersModule --> MongooseModule: "Imports MongooseModule with forFeature"
UsersModule --> UsersController: "Provides UsersController"
UsersModule --> UsersService: "Provides UsersService"
UsersService --> User: "Uses User schema"
UsersService --> CreateUserDto: "Uses CreateUserDto"
UsersController --> UsersService: "Injects UsersService"
User <|-- UserSchema : "createForClass(User)"

```

## User Module

The Users module is where all the user-related functionality is encapsulated. It includes the controller, service, and schema definitions.

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

```

```mermaid
graph TD
    UsersModule[UsersModule]
    
    UsersModule --"Imports"--> MongooseModule[MongooseModule.forFeature]
    MongooseModule --"Defines"--> UserSchema[UserSchema]
    
    UsersModule --"Contains"--> UsersController[UsersController]
    UsersModule --"Provides"--> UsersService[UsersService]
    
    UsersController --"Uses"--> UsersService[UsersService]
    UsersService --"Interacts with"--> UserSchema[UserSchema]

    classDef module fill:#9f9,stroke:#333,stroke-width:2px;
    classDef controller fill:#9ff,stroke:#333,stroke-width:2px;
    classDef service fill:#f99,stroke:#333,stroke-width:2px;
    classDef schema fill:#ff9,stroke:#333,stroke-width:2px;

    class UsersModule module;
    class MongooseModule module;
    class UsersController controller;
    class UsersService service;
    class UserSchema schema;

```

## User Controller - User Service - User Schema
```mermaid
graph TD
    UserController[User Controller]
    UserService[User Service]
    UserSchema[User Schema]
    CreateUserDTO[Create User DTO]

    UserController -- "Calls service methods" --> UserService
    UserService -- "Interacts with schema" --> UserSchema
    UserController -- "Uses DTO for data validation" --> CreateUserDTO
    UserService -- "Receives validated data" --> CreateUserDTO

    classDef controller fill:#9ff,stroke:#333,stroke-width:2px;
    classDef service fill:#9f9,stroke:#333,stroke-width:2px;
    classDef schema fill:#ff9,stroke:#333,stroke-width:2px;
    classDef dto fill:#f99,stroke:#333,stroke-width:2px;

    class UserController controller;
    class UserService service;
    class UserSchema schema;
    class CreateUserDTO dto;

```

Users controller handles incoming requests related to users, such as creating, retrieving, and deleting user records.
```typescript
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}

```
The Users service handles the business logic related to users, including creating and retrieving user records from the MongoDB database.

```typescript
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}

```



The User schema defines the structure of the user documents stored in the MongoDB database.

```mermaid
graph TD
    SchemaDecorator["@Schema Decorator"]
    UserClass[User Class]
    SchemaFactory["SchemaFactory.createForClass(User)"]
    UserSchema[User Schema]
    HydratedDocument[HydratedDocument<User>]
    UserDocument[User Document]

    SchemaDecorator -- "Marks User Class as a Mongoose schema" --> UserClass
    UserClass -- "Defines user properties" --> SchemaFactory
    SchemaFactory -- "Converts class to schema" --> UserSchema
    UserSchema -- "Creates document type" --> HydratedDocument
    HydratedDocument -- "Document with data and methods" --> UserDocument

    classDef schema fill:#ff9,stroke:#333,stroke-width:2px;
    classDef document fill:#9f9,stroke:#333,stroke-width:2px;
    classDef property fill:#9ff,stroke:#333,stroke-width:2px;
    classDef decorator fill:#ccf,stroke:#333,stroke-width:2px;
    classDef factory fill:#fcf,stroke:#333,stroke-width:2px;

    class UserSchema schema;
    class SchemaDecorator decorator;
    class SchemaFactory factory;
    class UserDocument document;
    class HydratedDocument document;

```

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

```


### Create User DTO

Create User DTO defines the structure of the data required to create a new user record.
```typescript
export class CreateUserDto {
  readonly name: string;
  readonly age: number;
}

```


## TEST

```bash
### Create User
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "John Doe",
  "age": 30
}

### Get All Users
GET http://localhost:3000/users

```

