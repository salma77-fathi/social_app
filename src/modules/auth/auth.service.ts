import type { Request, Response } from "express";
import type {
  IConfirmEmailBodyInputsDTO,
  ILoginBodyInputsDTO,
  ISignupBodyInputsDTO,
} from "./auth.dto.js";
import { UserModel } from "../../DB/models/User.model.js";
import { UserRepository } from "../../DB/repository/user.repository.js";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../utils/response/error.response.js";
import {
  compareHash,
  generateHash,
} from "../../utils/security/hash.security.js";
import { emailEvent } from "../../utils/event/email.event.js";
import { generateNumberOtp } from "../../utils/otp.js";
import {
  createLoginCredential,
  generateToken,
} from "../../utils/security/token.security.js";

class AuthenticationService {
  private userModel = new UserRepository(UserModel);
  constructor() {}

  /**
   *
   * @param req -Express.Request
   * @param res -Express.Response
   * @returns   -Promise<Response>
   * @example ({username, email, password}:ISignupBodyInputsDTO)
   * return {message:"Done" , statusCode:201}
   */

  signup = async (req: Request, res: Response): Promise<Response> => {
    let { username, email, password }: ISignupBodyInputsDTO = req.body;
    console.log({ username, email, password });
    const checkUserExits = await this.userModel.findOne({
      filter: { email },
    });
    if (checkUserExits) {
      throw new ConflictException("this user is already exits");
    }
    const otp = generateNumberOtp();
    const user = await this.userModel.createUser({
      data: [
        {
          username,
          email,
          password: await generateHash(password),
          confirmEmailOtp: await generateHash(String(otp)),
        },
      ],
    });
    emailEvent.emit("Confirm-Email", { to: email, otp });
    return res.status(201).json({ message: "Done", data: { user } });
  };

  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp }: IConfirmEmailBodyInputsDTO = req.body;
    const user = await this.userModel.findOne({
      filter: {
        email,
        confirmEmail: { $exists: true },
        confirmedAt: { $exists: false },
      },
    });
    if (!user) {
      throw new NotFoundException("Invalid account");
    }
    if (!(await compareHash(otp, user.confirmEmailOtp as string))) {
      throw new ConflictException("invalid code");
    }
    await this.userModel.update({
      filter: {
        email,
      },
      update: { confirmedAt: new Date(), $unset: { confirmEmailOtp: 1 } },
    });
    return res.json({ message: "Done" });
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: ILoginBodyInputsDTO = req.body;
    const user = await this.userModel.findOne({
      filter: { email },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.confirmedAt) {
      throw new BadRequestException("Verify your account first");
    }
    if (!(await compareHash(password, user.password))) {
      throw new NotFoundException("Invalid login data");
    }
    const credential = createLoginCredential(user);
    return res.json({
      message: "Done",
      data: { credentials: credential },
    });
  };
}
export default new AuthenticationService();

/*notes--------------------------------------------------------------------------*/

// *****************first way of how to catch an error************************
// try {
//   validators.signup.body.parse(req.body);
// } catch (error) {
//   throw new BadRequestException("Validation Error", {
//     issues:JSON.parse(error as string),
//   });
// }

// *****************second way of how to catch an error************************
// const validationResult = validators.signup.body.safeParse(req.body);
// if (!validationResult.success) {
//   throw new BadRequestException("validation Error", {
//     issues: JSON.parse(validationResult.error as unknown as string),
//   });
// }
