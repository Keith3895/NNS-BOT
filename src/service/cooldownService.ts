const DEFAULT_COOLDOWN = 1000;
export default class CooldownHandler {
    cooldownStack = new Map();

    set cooldown(cmd) {
        const cooldownTimeout = cmd.cooldown || DEFAULT_COOLDOWN;
        const currTime = new Date().getTime();
        this.cooldownStack.set(cmd.name, {
            timeout: currTime +
                cooldownTimeout, ...cmd
        });
        setTimeout(() => this.removeCooldown(cmd), cooldownTimeout);
    }
    isCooldown(cmd): boolean {
        return this.cooldownStack.has(cmd.name);
    }
    removeCooldown(cmd) {
        this.cooldownStack.delete(cmd.name);
    }
    timeleft(cmd): string {
        const cooldownEntry = this.cooldownStack.get(cmd.name);
        if (!cooldownEntry)
            return '0';
        let currTime = new Date().getTime();
        return ((cooldownEntry['timeout'] - currTime) / 1000).toFixed(1);
    }
}
