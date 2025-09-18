// lib/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  // NOTE: for Android emulator use 10.0.2.2, for desktop use localhost
  static const String baseUrl = 'http://localhost:5000';
  static final _storage = const FlutterSecureStorage();

  // ---------------- AUTH ----------------

  // Register
  static Future<http.Response> register(String username, String email, String password) {
    final uri = Uri.parse('$baseUrl/api/user/create');
    return http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'email': email, 'password': password}),
    );
  }

  // Login
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final uri = Uri.parse('$baseUrl/api/user/login');
    final res = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    return {
      'statusCode': res.statusCode,
      'body': res.body.isNotEmpty ? jsonDecode(res.body) : null
    };
  }

  // Save token + user info
  static Future<void> saveTokenAndUser(Map<String, dynamic> loginBody) async {
    final token = loginBody['token'] as String?;
    final user = loginBody['user'];
    if (token != null && user != null) {
      await _storage.write(key: 'jwt', value: token);
      await _storage.write(key: 'userId', value: user['id'].toString());
      await _storage.write(key: 'username', value: user['username']);
    }
  }

  // ---------------- STORAGE HELPERS ----------------

  static Future<String?> getToken() => _storage.read(key: 'jwt');

  static Future<int?> getUserId() async {
    final id = await _storage.read(key: 'userId');
    return id != null ? int.tryParse(id) : null;
  }

  static Future<String?> getUsername() => _storage.read(key: 'username');

  static Future<void> logout() async {
    await _storage.deleteAll();
  }

  // ---------------- API CALLS ----------------

  // Get conversations for a user (protected)
  static Future<List<dynamic>> getConversations(int userId) async {
    final token = await getToken();
    final uri = Uri.parse('$baseUrl/conversations/$userId');
    final res = await http.get(uri, headers: {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token'
    });

    if (res.statusCode == 200) {
      return jsonDecode(res.body) as List<dynamic>;
    } else {
      throw Exception('Failed to load conversations (${res.statusCode})');
    }
  }
}
