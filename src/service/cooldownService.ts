export default class CooldownHandler {
    cooldownStack = new Map();

    set cooldown(cmd) {
        let cooldownTimeout = cmd.cooldown || 1000;
        let currTime = new Date().getTime();
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
        let cooldownEntry = this.cooldownStack.get(cmd.name);
        if (!cooldownEntry)
            return '0';
        let currTime = new Date().getTime();
        return ((cooldownEntry['timeout'] - currTime) / 1000).toFixed(1);
    }
}
