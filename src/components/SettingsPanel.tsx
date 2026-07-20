import type { UserSettings } from '../lib/userSettings';
import { CameraPermission } from './CameraPermission';

type Props={settings:UserSettings;onChange:(settings:UserSettings)=>void};

export function SettingsPanel({settings,onChange}:Props){
  const update=<K extends keyof UserSettings>(key:K,value:UserSettings[K])=>onChange({...settings,[key]:value});
  const text=settings.language==='en'
    ?{title:'Settings',language:'Language',brightness:'Brightness',dark:'Dark',normal:'Normal',bright:'Bright',textSize:'Text size',large:'Large',sound:'Sounds',motion:'Reduce motion'}
    :{title:'Настройки',language:'Язык',brightness:'Яркость',dark:'Тёмная',normal:'Обычная',bright:'Яркая',textSize:'Размер текста',large:'Крупный',sound:'Звуки',motion:'Меньше анимаций'};
  return <section className="settings-panel"><h3>⚙ {text.title}</h3><label><span>{text.language}</span><select value={settings.language} onChange={(event)=>update('language',event.target.value as UserSettings['language'])}><option value="ru">Русский</option><option value="en">English</option></select></label><label><span>{text.brightness}</span><select value={settings.brightness} onChange={(event)=>update('brightness',Number(event.target.value) as UserSettings['brightness'])}><option value="80">{text.dark}</option><option value="100">{text.normal}</option><option value="115">{text.bright}</option></select></label><label><span>{text.textSize}</span><select value={settings.textSize} onChange={(event)=>update('textSize',event.target.value as UserSettings['textSize'])}><option value="normal">{text.normal}</option><option value="large">{text.large}</option></select></label><label className="settings-toggle"><span>{text.sound}</span><input type="checkbox" checked={settings.sound} onChange={(event)=>update('sound',event.target.checked)}/></label><label className="settings-toggle"><span>{text.motion}</span><input type="checkbox" checked={settings.reducedMotion} onChange={(event)=>update('reducedMotion',event.target.checked)}/></label><CameraPermission enabled={settings.cameraAccess} language={settings.language} onChange={(enabled)=>update('cameraAccess',enabled)}/></section>;
}
