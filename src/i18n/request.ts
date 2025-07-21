import { auth } from '@/lib/auth';
import { getUserLangPreferences } from '@/modules/preferences/services/preferences.service';
import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async () => {

    const session = await auth()

    if(!session || !session.user) {
    
        return {
            locale: 'it',
            messages: (await import(`../../messages/it/it.json`)).default
        };

    }

    const userId = session.user.id;

    const langPreference = await getUserLangPreferences(Number(userId))

    if (!langPreference) {
        return {
            locale: 'it',
            messages: (await import(`../../messages/it/it.json`)).default
        };
    }

    const locale = langPreference.lang;

    return {
    locale,
    messages: (await import(`../../messages/${locale}/${locale}.json`)).default
    };
});