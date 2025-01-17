// NOTE: 사용자와 관련된 기능 처리 컨트롤러
// NOTE: 회원가입, 로그인, 프로필 조회 및 수정

/**
 * @param req - 요청 객체
 * @param res - 응답 객체
 * @param next - 다음 미들웨어로 넘기는 함수
 */
const UserModel = require("../models/userModel");
const tokenUtils = require("../utils/tokenUtils");
const bcrypt = require("bcrypt");

const userController = {
  // 회원 가입
  async signUp(req, res, next) {
    try {
      await UserModel.createUser(req.body);
      res.status(201).send({ message: `User signed up successfully.` });
      // 개발 환경에서 회원가입 확인
      if (process.env.NODE_ENV === "development") {
        console.log(`User created: `, req.body.email);
      }
    } catch (error) {
      next(error);
    }
  },

  // 로그인
  async signIn(req, res, next) {
    try {
      const user = await UserModel.findUserByEmail(req.body.email);
      if (!user) {
        return res.status(404).send({ message: `User not found` });
      }

      // 소셜 로그인 사용자인지 확인
      if (user.socialLoginType) {
        // NOTE: 소셜 로그인 사용자는 비밀번호 검증이 필요 없음
        const token = tokenUtils.generateToken(
          { email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        return res.status(200).send({ token });
      }

      // 일반 로그인 사용자의 경우 비밀번호 검증
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(401).send({ message: `Invalid credentials` });
      }

      // TODO: 토큰 생성과 응답 로직을 함수로 추출하여 중복 최소화
      const token = tokenUtils.generateToken(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).send({ token });
    } catch (error) {
      next(error);
    }
  },

  // 사용자 프로필 조회
  async getProfile(req, res, next) {
    try {
      const user = await UserModel.findUserByEmail(req.user.email);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  },

  // 사용자 프로필 수정
  async updateProfile(req, res, next) {
    try {
      const updateDate = req.body;
      await UserModel.updateUser(req.body.email, updateDate);
      res.status(200).send({ message: `Profile updated successfully` });
    } catch (error) {
      next(error);
    }
  },

  // 사용자 탈퇴
  async deleteProfile(req, res, next) {
    try {
      await UserModel.deleteUser(req.user.email);
      res.status(200).send({ message: `User deleted successfully` });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
