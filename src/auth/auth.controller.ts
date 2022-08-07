import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('/signup')
    async createUser(
        @Body() authCredentials: AuthCredentialsDto
    ): Promise<User> {
        return this.authService.createUser(authCredentials);
    }

    @Post('/signin')
    async signIn(
        @Body() authCredentials: AuthCredentialsDto
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentials);
    }
}
