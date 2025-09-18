// lib/pages/signup_page.dart
import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/api_services.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});
  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _username = TextEditingController();
  final TextEditingController _email = TextEditingController();
  final TextEditingController _password = TextEditingController();
  bool _loading = false;

  void _register() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);

    final res = await ApiService.register(
      _username.text.trim(),
      _email.text.trim(),
      _password.text.trim(),
    );

    setState(() => _loading = false);

    if (res.statusCode == 201 || res.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Registered successfully. Please log in.')));
      Navigator.pushReplacementNamed(context, '/login');
    } else {
      String message = 'Registration failed';
      try {
        final body = jsonDecode(res.body);
        message = body['error'] ?? body['message'] ?? message;
      } catch (_) {}
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sign Up')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(children: [
            TextFormField(controller: _username, decoration: const InputDecoration(labelText: 'Username'), validator: (v) => v == null || v.isEmpty ? 'Enter username' : null),
            TextFormField(controller: _email, decoration: const InputDecoration(labelText: 'Email'), validator: (v) => v == null || v.isEmpty ? 'Enter email' : null),
            TextFormField(controller: _password, decoration: const InputDecoration(labelText: 'Password'), obscureText: true, validator: (v) => v == null || v.length < 6 ? 'Min 6 chars' : null),
            const SizedBox(height: 20),
            _loading ? const CircularProgressIndicator() : ElevatedButton(onPressed: _register, child: const Text('Register')),
            TextButton(onPressed: () => Navigator.pushReplacementNamed(context, '/login'), child: const Text('Already have account? Login'))
          ]),
        ),
      ),
    );
  }
}
