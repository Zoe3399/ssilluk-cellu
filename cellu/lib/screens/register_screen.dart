import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import '../widgets/custom_text_field.dart';
import '../styles.dart';

import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final ValueNotifier<bool> _isPasswordVisible = ValueNotifier(false);
  final ValueNotifier<bool> _isConfirmPasswordVisible = ValueNotifier(false);

  @override
  void dispose() {
    _isPasswordVisible.dispose();
    _isConfirmPasswordVisible.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
          child: Padding(
        padding: EdgeInsets.all(AppDimensions.pagePaddingHorizontal),
        child: Column(
          children: [
            SizedBox(height: 60), // Top padding
            SvgPicture.asset('assets/logo-small.svg'), // 로고
            SizedBox(height: 40), // 로고와 폼 사이의 간격
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.5),
                    spreadRadius: 5,
                    blurRadius: 7,
                    offset: Offset(0, 3),
                  )
                ],
              ),
              child: Column(
                children: [
                  Text('회원가입', style: AppStyles.titleStyle),
                  SizedBox(height: 20),
                  CustomTextField(
                    label: '이메일',
                    hint: '이메일을 입력하세요',
                    obscureText: false,
                    prefixIcon: Icons.email,
                  ),
                  SizedBox(height: 20),
                  _buildPasswordInputField(
                    '비밀번호',
                    _isPasswordVisible,
                  ),
                  SizedBox(height: 20),
                  _buildPasswordInputField(
                    '비밀번호 확인',
                    _isConfirmPasswordVisible,
                  ),
                  SizedBox(height: 30),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      primary: AppColors.primaryColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                      padding:
                          EdgeInsets.symmetric(horizontal: 80, vertical: 15),
                    ),
                    onPressed: () {},
                    child: Text('회원가입'),
                  ),
                  SizedBox(height: 20),
                  TextButton(
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (context) => LoginScreen()),
                      );
                    },
                    child: Text(
                      '아이디가 있으신가요? 로그인',
                      style: AppStyles.linkStyle,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      )),
    );
  }

  Widget _buildPasswordInputField(
      String label, ValueNotifier<bool> visibilityNotifier) {
    return ValueListenableBuilder(
      valueListenable: visibilityNotifier,
      builder: (context, value, child) {
        return CustomTextField(
          label: label,
          hint: label,
          obscureText: !value,
          prefixIcon: Icons.lock,
          suffixIcon: IconButton(
            icon: Icon(
              value ? Icons.visibility : Icons.visibility_off,
            ),
            onPressed: () => visibilityNotifier.value = !value,
          ),
        );
      },
    );
  }
}
