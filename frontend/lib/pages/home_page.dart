// lib/pages/home_page.dart
import 'package:flutter/material.dart';
import '../services/api_services.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Future<List<dynamic>> _conversationsFuture;
  String? _userId;
  String? _username;

  @override
  void initState() {
    super.initState();
    _loadUserAndConversations();
  }

  void _loadUserAndConversations() async {
   final uid = await ApiService.getUserId();
final uname = await ApiService.getUsername();

if (uid != null) {
 
    _conversationsFuture = ApiService.getConversations(uid);
  
}
    setState(() {
      _userId = uid?.toString();
      _username = uname;
      if (uid != null) {
        _conversationsFuture = ApiService.getConversations(uid);
      }
    });
  }

  void _logout() async {
    await ApiService.logout();
    if (mounted) Navigator.pushReplacementNamed(context, '/login');
  }

  Widget _buildConversationTile(dynamic conv) {
    // conv expected to contain: id, name (maybe null), members: [ { id, user: { username } }, ... ]
    final name = conv['name'] as String?;
    final members = conv['members'] as List<dynamic>? ?? [];
    final otherNames = members.map((m) {
      final user = m['user'];
      return user != null ? user['username'] : null;
    }).where((e) => e != null).cast<String>().toList();

    final displayName = name != null && name.isNotEmpty ? name : otherNames.join(', ');

    return ListTile(
      title: Text(displayName.isNotEmpty ? displayName : 'Conversation ${conv['id']}'),
      subtitle: Text('Members: ${otherNames.join(', ')}'),
      onTap: () {
        // TODO: navigate to chat screen later
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Open conversation ${conv['id']} (not implemented)')));
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Conversations${_username != null ? " - $_username" : ""}'),
        actions: [IconButton(icon: const Icon(Icons.logout), onPressed: _logout)],
      ),
      body: _userId == null
          ? const Center(child: CircularProgressIndicator())
          : FutureBuilder<List<dynamic>>(
              future: _conversationsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                }
                final convs = snapshot.data ?? [];
                if (convs.isEmpty) return const Center(child: Text('No conversations yet'));
                return ListView.builder(
                  itemCount: convs.length,
                  itemBuilder: (context, i) => _buildConversationTile(convs[i]),
                );
              },
            ),
    );
  }
}
