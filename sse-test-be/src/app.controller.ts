import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { exec } from 'child_process';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * 前端测试接口
   * 添加一个sse接口，名字叫stream
   */
  @Sse('stream')
  stream() {
    return new Observable((observer) => {
      observer.next({
        data: {
          msg: 'aaa',
        },
      });

      setTimeout(() => {
        observer.next({
          data: {
            msg: 'bbb',
          },
        });
      }, 2000);

      // setTimeout(() => {
      //   observer.next({
      //     data: {
      //       msg: 'ccc',
      //     },
      //   });
      // }, 5000);
    });
  }

  // 服务端日志测试接口
  @Sse('stream')
  log() {
    // 执行 tail -f命令实时获取文件内容
    const childProcess = exec('tail -f ./log');

    return new Observable((observer) => {
      childProcess.stdout.on('data', (msg) => {
        console.log('msg: ', msg);
        observer.next({ data: { msg: msg.toString() } });
      });
    });
  }
}
