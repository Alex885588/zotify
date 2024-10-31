import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { UserRole } from "src/enums/user.role.enum";

@Injectable()
export class AdminAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            if (request.user.role === UserRole.Admin) {
                return true;
            }
            return false;
        } catch (err) {
            return false;
        }
    }
}
