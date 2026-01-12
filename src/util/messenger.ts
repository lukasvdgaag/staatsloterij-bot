import { Promotion } from "../type/types";

export const sendDiscordNotification = async (promotion: Promotion, webhookUrl: string): Promise<void> => {
    if (!webhookUrl) {
        console.error('Discord webhook URL not configured');
        return;
    }

    try {
        const embed = {
            title: promotion.title,
            description: promotion.description,
            color: 0xFF6601,
            author: {
                name: 'Nieuwe Staatsloterij promotie!',
            },
            image: promotion.imageUrl ? { url: promotion.imageUrl } : undefined,
            timestamp: new Date().toISOString(),
            footer: {
                text: 'StaatsLoterij Promotions',
            },
        };

        const components = promotion.ctaUrl && promotion.ctaText ? [{
            type: 1, // Action Row
            components: [{
                type: 2, // Button
                style: 5, // Link button
                label: promotion.ctaText,
                url: promotion.ctaUrl,
            }],
        }] : [];

        const payload = {
            embeds: [embed],
            components,
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });


        if (!response.ok) {
            console.error(await response.text());
            throw new Error(`Discord API error! status: ${response.status}`);
        }

        console.log(`Notification sent for: ${promotion.title}`);
    } catch (error) {
        console.error('Error sending Discord notification:', error);
    }
}