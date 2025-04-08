export function waitUntilAnimationsFinish(element) {
    const animationPromises = element.getAnimations().map(animation => animation.finish);

    return Promise.allSettled(animationPromises);
}