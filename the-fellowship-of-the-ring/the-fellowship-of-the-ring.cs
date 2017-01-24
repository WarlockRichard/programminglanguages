using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Concurrent;
namespace lab4
{
    public class Token
    {
        private string _message;
        private int _reciever;
        private int _emitter;

        public string Message { get { return _message; } set { _message = value; } }
        public int Reciever { get { return _reciever; } }
        public int Emitter { get { return _emitter; } }


        public Token(string message, int reciever, int emitter)
        {
            _message = message;
            _reciever = reciever;
            _emitter = emitter;
        }
    }

    class Program
    {
        const int ThreadQuan = 10;
        const int emitter = 7;
        const int reciever = 30;
        const string message = "Message";
        static void Main(string[] args)
        {
            var conQueues = new ConcurrentQueue<Token>[ThreadQuan];
            for (var i = 0; i < ThreadQuan; i++)
            {
                conQueues[i] = new ConcurrentQueue<Token>();
            }
            var threads = new Thread[ThreadQuan];
            for (var i = 0; i < ThreadQuan - 1; i++)
            {
                var index = i;
                threads[i] = new Thread(() =>
                {
                    NewThread(conQueues[index], conQueues[index + 1], index);
                });
            }
            threads[ThreadQuan - 1] = new Thread(() =>
            {
                NewThread(conQueues[ThreadQuan - 1], conQueues[0], ThreadQuan - 1);
            });
            for (var i = 0; i < ThreadQuan; i++)
            {
                threads[i].Start();
            }
            Token token = new Token(message, reciever, emitter);
            conQueues[emitter+1].Enqueue(token);
            threads[emitter].Join();
            Console.Read();
        }

        unsafe static void NewThread(ConcurrentQueue<Token> inQueue, ConcurrentQueue<Token> outQueue, int id)
        {
            while (true)
            {
                Token resToken;
                if (!inQueue.TryDequeue(out resToken))
                {
                    Thread.Sleep(100);
                    continue;
                }
                else
                {
                    if(resToken.Message == "DIE")
                    {
                        outQueue.Enqueue(resToken);
                        break;
                    }
                    if (resToken.Emitter == id)
                    {
                        Console.WriteLine("Reciever not found!");
                        break;
                    }
                    else if (resToken.Reciever == id)
                    {
                        Console.WriteLine(string.Format("I'm the receiver! The message i've got:{0}", resToken.Message));
                        resToken.Message = "DIE";
                        outQueue.Enqueue(resToken);
                        break;
                    }
                    else
                    {
                        outQueue.Enqueue(resToken);
                    }
                }
                
            }
        }
    }
}
