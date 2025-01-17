// NOTE: 센서 데이터를 받아 예측 모델 서버에 전송, 결과를 데이터베이스에 저장

/**
 * @param res - 응답 객체
 * @param req - 요청 객체
 * @param next - 다음 미들웨어로 넘기는 함수
 */

const axios = require("axios");
const sensorModel = require("../models/sensorModel");
const notificationService = require("../services/notificationService");

const PREDICTION_MODEL_SERVER_URL = `http://${process.env.PREDICTION_SERVER_HOSTNAME}:${process.env.PREDICTION_SERVER_PORT}/${process.env.PREDICTION_SERVER_PATH}`;

const sensorController = {
  processSensorData: async (req, res, next) => {
    try {
      const userEmail = req.user.email; // 인증된 사용자의 ID
      const sensorData = req.body; // 센서 데이터

      // 예측 모델 서버로 데이터 전송 및 결과 받기
      const { data } = await axios.post(
        PREDICTION_MODEL_SERVER_URL,
        sensorData
      );
      const predictionResult = data.prediction;

      // 데이터베이스에 센서 데이터와 예측 결과 저장
      await sensorModel.saveData(userEmail, sensorData, predictionResult);

      // 예측 결과가 54 이하 또는 공복시 300 이상인 경우 SMS 알림 전송
      if (
        predictionResult <= 54 ||
        (sensorData.beforeAfterMeal === "before" && predictionResult >= 300)
      ) {
        // TODO: 공복시 300 이상인 경우의 데이터 추적 및 질의 로직 추가 필요
        // const isHighGlucoseConsistent = await sensorModel.checkConsistentHighGlucose(userEmail);

        // SMS 조건 검사
        if (predictionResult <= 54 || /* checkConsistentHighGlucose */ false) {
          try {
            // FIXME: 이 부분은 실제로 사용자의 전화번호를 조회하는 로직으로 대체해야 함
            const guardianPhoneNumber = process.env.SMS_MY_PHONE_NUMBER;
            // 사용자의 전화번호를 얻는 로직
            // const guardianPhoneNumber = await UserModel.getGuardianPhoneNumber(userEmail);
            const message =
              "측정된 생체 데이터가 정상 범위를 벗어났습니다. 주의가 필요합니다.";
            // SMS 전송
            await notificationService.sendSMS(
              guardianPhoneNumber,
              message,
              next
            );
          } catch (error) {
            next(error);
          }
        }
      }

      // 클라이언트에 성공 응답 전송
      res.status(200).json(predictionResult);
    } catch (error) {
      // 에러 처리
      next(error);
    }
  },
};

module.exports = sensorController;
