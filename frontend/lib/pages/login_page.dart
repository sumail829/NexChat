// lib/pages/login_page.dart
import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/api_services.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _email = TextEditingController();
  final TextEditingController _password = TextEditingController();
  bool _loading = false;

  void _login() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);

    final result = await ApiService.login(_email.text.trim(), _password.text.trim());
    setState(() => _loading = false);

    if (result['statusCode'] == 200 && result['body'] != null) {
      await ApiService.saveTokenAndUser(result['body']);
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      String msg = 'Login failed';
      try {
        final body = result['body'];
        if (body is Map && body['message'] != null) msg = body['message'];
      } catch (_) {}
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(children: [
            TextFormField(controller: _email, decoration: const InputDecoration(labelText: 'Email'), validator: (v) => v == null || v.isEmpty ? 'Enter email' : null),
            TextFormField(controller: _password, decoration: const InputDecoration(labelText: 'Password'), obscureText: true, validator: (v) => v == null || v.isEmpty ? 'Enter password' : null),
            const SizedBox(height: 20),
            _loading ? const CircularProgressIndicator() : ElevatedButton(onPressed: _login, child: const Text('Login')),
            TextButton(onPressed: () => Navigator.pushReplacementNamed(context, '/signup'), child: const Text('Create an account'))
          ]),
        ),
      ),
    );
  }
}
