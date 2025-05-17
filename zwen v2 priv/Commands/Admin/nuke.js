module.exports = {
  name: 'nuke',
  description: 'Metin kanalını silip aynı ayarlarla yeniden oluşturur.',
  async execute(client, message, args) {
    if (!message.member.permissions.has('ManageChannels'))
      return message.reply('Bu komutu kullanmak için `Kanalları Yönet` yetkisine sahip olmalısın.');

    const channel = message.channel;

    try {
      // Yeni kanal oluşturuluyor
      const newChannel = await channel.clone();
      await channel.delete();

      newChannel.send('Kanal başarıyla nukelendi! 🚀');
    } catch (err) {
      console.error(err);
      message.reply('Kanal nukeleme sırasında bir hata oluştu.');
    }
  },
};
