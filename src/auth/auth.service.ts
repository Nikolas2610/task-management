import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { Role } from './roles/roles.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const { username, password } = authCredentialsDto;

        // Hash Password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const role = Role.USER;
        const user: User = this.usersRepository.create({ username, password: hashedPassword, role: role });
        console.log(user)

        try {
            await this.usersRepository.save(user);
        } catch (error) {
            console.log(error)
            console.log(error.code)
            if (error.code === '23505') { // Duplicate Username
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
        return user;
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialsDto;

        const user = await this.usersRepository.findOneBy({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException('Please check your login credentials')
        }
    }
}
