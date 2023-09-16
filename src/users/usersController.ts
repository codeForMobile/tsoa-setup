import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Response,
    Route,
    Example,
    SuccessResponse,
  } from "tsoa";
  import { User } from "./user";
  import { UsersService, UserCreationParams } from "./usersService";
  import { ValidateErrorJSON } from "../utils/validateError";
  
  @Route("users")
  export class UsersController extends Controller {
    @Example<User>({
      id: 101,
      name: "tsoa user",
      email: "hello@tsoa.com",
      phoneNumbers: [],
      status: "Happy",
    })
    /**
     * Retrieves the details of an existing user.
     * Supply the unique user ID from either and receive corresponding user details.
     * @param userId The user's identifier
     * @param name Provide a username to display
     * @summary a concise summary
     */
    @Get("{userId}")
    public async getUser(
      @Path() userId: number,
      @Query() name?: string
    ): Promise<User> {
      return new UsersService().get(userId, name);
    }
  
    @Response<ValidateErrorJSON>(422, 'Validation Failed')
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createUser(
      @Body() requestBody: UserCreationParams
    ): Promise<void> {
      this.setStatus(201); // set return status 201
      new UsersService().create(requestBody);
      return;
    }
  }
