export default class CooldownHandler {
    cooldownStack = new Set();

    set cooldown(cmd) {
        this.cooldownStack.add(cmd.name);
        setTimeout(() => this.removeCooldown(cmd), cmd.cooldown || 1000);
    }
    isCooldown(cmd): boolean {
        return this.cooldownStack.has(cmd.name);
    }
    removeCooldown(cmd) {
        this.cooldownStack.delete(cmd.name);
    }
}
