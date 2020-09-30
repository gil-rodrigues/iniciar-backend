# Recuperação de senha

**RF**

- O utilizador deve poder recuperar a password através do e-mail;
- O utilizador deve receber um e-mail com instruções de recuperação da password;
- O utilizador deve poder fazer reset à password;

**RNF**

- Utilizar Mailtrap para fazer envio de e-mails em ambiente de dev
- Utilizar Amazon SES para envios em produção
- O envio de e-mails deve ocorrer em 2º plano (background job)

**RN**

- O link enviado por e-mail para reset de password deve expirar em 2h
- O utilizador tem que confirmar a nova password ao fazer o reset

# Atualização do perfil

**RF**

- O utilizador deve poder atualizar nome, e-mail e password

**RN**

- O utilizador não pode alterar o e-mail para um já utilizado
- Para atualizar a password, o utilizador deve informar a password antiga
- Para atualizar a password, o utilizador deve confirmar a nova password

# Painel do prestador

**RF**

- O utilizador deve poder listar os seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas.

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas em MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io

**RN**

- A notificação deve ter um estado de lida ou não lida, para que o prestador possa controlar;


# Agendamento de serviços

**RF**

- O utilizador deve poder listar todos os prestadores de serviço registados;
- O utilizador deve poder listar os dias de um mês com, pelo menos, um horário disponível;
- O utilizador deve poder listar horários disponíveis em um dia específico de um prestador;
- O utilizador deve poder realizar um novo agendamento com um prestador.

**RNF**

- A listagem de prestadores deve ser armazenada em cache

**RN**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre as 8h e as 18h (Primeiro às 8h, último às 17h)
- O utilizador não pode agendar em um horário já ocupado;
- O utilizador não pode agendar em um horário que já passou;
- O utilizador não pode agendar serviços consigo mesmo.

