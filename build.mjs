import fs from 'node:fs/promises';
import sharp from 'sharp';

const OUT = 'dist';
const WA = '5521000000000';
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3KLBcar2vQx7c9CKMkSdFRrDp3o/hf_20261111_';
const IMGS = {
  hero: '000117_d52252bb-0c20-463b-ac36-4470733c915e',
  recepcao: '000117_6ac28203-495c-49b3-b1e2-303067f6dffd',
  sala: '000041_0b117b09-2bfc-4f49-9801-f1f3b347a008',
  helena: '000117_ff1e1b15-1a73-42e6-bbf0-70ecf62afec7',
  rafael: '000154_dfb170e0-69e2-42b0-8f6f-eb2e83842ab1',
  camila: '000154_0b925403-5085-4c00-a472-c90f5f1b5a33',
  implante: '000154_a5c08a10-c304-48f7-a5ca-962c2ec87680',
  protocolo: '000041_e9756b2f-f7dd-48ea-a170-f27a01ee66b9',
  alinhador: '000154_02d130f7-2249-4025-9fdf-90584a42b7bd',
  clareamento: '000041_c899b6df-47d8-430a-a0ff-774e6f8ca66e',
  lentes: '000042_4421df46-77f9-402f-a562-efb6a39d797c',
  consulta: '000223_93dc1b10-9a74-4d02-91fd-bd64faab3823'
};
const TALL = ['hero', 'helena', 'rafael', 'camila'];

const T = [
  { slug: 'implantes-dentarios', nome: 'Implantes dentários', img: 'implante', bg: '#FFFFFF', fg: '#0F1F1D',
    curto: 'Raízes de titânio e coroas de porcelana que ninguém distingue dos dentes naturais.',
    lead: 'O implante devolve o dente inteiro, da raiz à coroa. Você volta a mastigar com firmeza e preserva o osso e os dentes vizinhos.',
    fatos: [['Duração', '1 a 3 sessões'], ['Anestesia', 'Local, com sedação opcional'], ['Recuperação', '2 a 3 dias']],
    para: ['Quem perdeu um ou mais dentes', 'Quem usa ponte móvel e quer algo fixo', 'Quem precisa extrair um dente condenado'],
    etapas: [['Avaliação e tomografia 3D', 'Medimos a altura e a espessura do osso e definimos a posição exata do implante.'], ['Cirurgia guiada', 'O implante é instalado com um guia impresso em 3D. Leva cerca de 40 minutos por implante.'], ['Cicatrização', 'O osso se une ao titânio em 2 a 4 meses. Nesse período você usa um dente provisório.'], ['Coroa definitiva', 'Instalamos a coroa de porcelana na cor e no formato dos seus dentes.']],
    faq: [['Implante dói?', 'A cirurgia é feita com anestesia local e, se você preferir, sedação consciente. O incômodo dos primeiros dias é leve e controlado com analgésico comum.'], ['Tenho pouco osso. Posso fazer?', 'Na maioria dos casos, sim. O enxerto ósseo permite reabilitar mesmo quem perdeu os dentes há muitos anos. A tomografia mostra o caminho para o seu caso.'], ['Quanto tempo dura um implante?', 'Com higiene e revisões a cada seis meses, o implante pode durar décadas. Damos garantia de 5 anos.']] },
  { slug: 'protese-protocolo', nome: 'Prótese protocolo', img: 'protocolo', bg: '#CFE6DC', fg: '#0F1F1D',
    curto: 'Uma arcada inteira de dentes fixos sobre 4 a 6 implantes. Dentadura nunca mais.',
    lead: 'O protocolo é uma arcada completa parafusada sobre implantes. Não sai para dormir, não usa adesivo e devolve a firmeza para comer e sorrir.',
    fatos: [['Dentes fixos', 'Em até 72 horas'], ['Implantes', '4 a 6 por arcada'], ['Prótese final', '3 a 6 meses']],
    para: ['Quem usa dentadura e quer dentes fixos', 'Quem perdeu todos ou quase todos os dentes', 'Quem tem dentes muito comprometidos'],
    etapas: [['Avaliação e tomografia', 'Exame clínico, tomografia 3D e escaneamento da boca, tudo feito na clínica.'], ['Planejamento digital', 'Você vê o novo sorriso na tela e aprova o formato, a cor e o tamanho dos dentes.'], ['Cirurgia guiada', 'Os implantes são posicionados com um guia impresso em 3D, sob anestesia local e sedação.'], ['Prótese provisória fixa', 'Em até 72 horas você recebe dentes provisórios parafusados e já sai sorrindo.'], ['Prótese definitiva', 'Após a cicatrização, instalamos a prótese final em resina reforçada ou zircônia.']],
    faq: [['Vou ficar sem dentes em algum momento?', 'Não. Você sai da cirurgia com a prótese provisória fixa ou a recebe em até 72 horas.'], ['Qual a diferença para a dentadura?', 'A dentadura se apoia na gengiva e se move. O protocolo é parafusado nos implantes, não cobre o céu da boca e só o dentista remove.'], ['Como é a limpeza?', 'Escova, fio dental próprio e irrigador em casa. A cada seis meses fazemos a limpeza profissional na clínica.']] },
  { slug: 'alinhadores-invisiveis', nome: 'Alinhadores invisíveis', img: 'alinhador', bg: '#E9DFCF', fg: '#0F1F1D',
    curto: 'Placas transparentes que alinham os dentes sem brackets, sem fios e sem ninguém notar.',
    lead: 'Você troca de placa a cada uma ou duas semanas e os dentes se movem aos poucos. Tira para comer e escovar, e segue a vida normalmente.',
    fatos: [['Duração', '6 a 18 meses'], ['Uso diário', '22 horas'], ['Consultas', 'A cada 6 a 8 semanas']],
    para: ['Dentes tortos ou apinhados', 'Espaços entre os dentes', 'Quem já usou aparelho e os dentes voltaram a entortar'],
    etapas: [['Escaneamento 3D', 'Um scanner registra seus dentes em minutos, sem massa de moldagem.'], ['Simulação do resultado', 'Você vê no computador como o sorriso vai ficar antes de começar.'], ['Entrega das placas', 'Você recebe os alinhadores e as orientações de uso.'], ['Acompanhamento', 'Revisões rápidas a cada seis a oito semanas até o resultado final.']],
    faq: [['Funciona para qualquer caso?', 'Resolve a maior parte dos casos, inclusive alguns complexos. Na avaliação dizemos com sinceridade se é a melhor opção para você.'], ['Atrapalha para falar?', 'Nos primeiros dias pode haver uma leve diferença na fala, que some com a adaptação.'], ['Preciso usar contenção depois?', 'Sim. A contenção mantém os dentes na nova posição e faz parte do tratamento.']] },
  { slug: 'clareamento-dental', nome: 'Clareamento dental', img: 'clareamento', bg: '#0E3531', fg: '#F4F3EF',
    curto: 'Dentes vários tons mais claros, com controle de sensibilidade e resultado natural.',
    lead: 'Combinamos sessões no consultório com moldeiras para uso em casa. O clareamento é seguro, não desgasta o esmalte e respeita o tom natural do seu sorriso.',
    fatos: [['Duração', '2 a 3 semanas'], ['Sessões', '1 a 2 no consultório'], ['Resultado', 'Dura de 1 a 3 anos']],
    para: ['Dentes amarelados pelo tempo', 'Manchas de café, vinho ou cigarro', 'Quem vai fazer lentes e quer uniformizar a cor'],
    etapas: [['Avaliação e limpeza', 'Verificamos a saúde da gengiva e do esmalte e registramos a cor inicial.'], ['Sessão no consultório', 'Aplicamos o gel clareador com proteção da gengiva. Leva cerca de uma hora.'], ['Moldeiras em casa', 'Você usa as moldeiras por alguns dias para completar e estabilizar o resultado.']],
    faq: [['Clareamento estraga os dentes?', 'Não. Feito com acompanhamento, o gel age só no pigmento e não desgasta o esmalte.'], ['Vou sentir sensibilidade?', 'Algumas pessoas sentem nos primeiros dias. Usamos dessensibilizante antes e depois para reduzir o desconforto.'], ['Restaurações clareiam?', 'Não. Se você tem restaurações nos dentes da frente, pode ser necessário trocá-las depois do clareamento.']] },
  { slug: 'lentes-de-contato-dental', nome: 'Lentes de contato dental', img: 'lentes', bg: '#FFFFFF', fg: '#0F1F1D',
    curto: 'Lâminas de porcelana de 0,3 mm que corrigem cor, formato e pequenos espaços.',
    lead: 'As lentes são coladas sobre os dentes com desgaste mínimo. O formato e a cor são definidos com você, em um ensaio que você prova na boca antes da versão final.',
    fatos: [['Duração', '2 a 4 sessões'], ['Espessura', 'A partir de 0,3 mm'], ['Durabilidade', '10 a 15 anos']],
    para: ['Dentes escurecidos que não clareiam', 'Dentes pequenos, gastos ou com formato irregular', 'Pequenos espaços entre os dentes'],
    etapas: [['Planejamento do sorriso', 'Fotos, escaneamento e desenho digital do novo sorriso.'], ['Ensaio na boca', 'Você prova o resultado em resina provisória e ajusta o que quiser.'], ['Confecção das lentes', 'O laboratório produz as lentes em porcelana, uma a uma.'], ['Colagem', 'As lentes são coladas e polidas em uma única sessão.']],
    faq: [['Precisa desgastar os dentes?', 'Em muitos casos o desgaste é mínimo ou nem existe. Isso é definido no planejamento.'], ['As lentes mancham?', 'A porcelana não mancha com café ou vinho e mantém a cor por muitos anos.'], ['Fica com cara de artificial?', 'Não. Escolhemos cor e formato de acordo com o seu rosto, a sua idade e o que você considera bonito.']] },
  { slug: 'prevencao-e-check-up', nome: 'Prevenção e check-up', img: 'consulta', bg: '#CFE6DC', fg: '#0F1F1D',
    curto: 'Limpeza, revisão e exames digitais para manter o sorriso saudável por muitos anos.',
    lead: 'A melhor odontologia é a que evita o tratamento. No check-up identificamos cáries e problemas de gengiva no começo, quando resolver é simples e barato.',
    fatos: [['Frequência', 'A cada 6 meses'], ['Duração', 'Cerca de 50 minutos'], ['Inclui', 'Limpeza e exame digital']],
    para: ['Quem está há mais de seis meses sem ir ao dentista', 'Quem tem gengiva que sangra ou mau hálito', 'Quem concluiu um tratamento e quer manter o resultado'],
    etapas: [['Conversa e exame clínico', 'Ouvimos suas queixas e examinamos dentes, gengiva e mordida.'], ['Limpeza profissional', 'Removemos placa e tártaro com ultrassom e jato de bicarbonato.'], ['Plano de cuidados', 'Você recebe por escrito o que precisa de atenção e quando voltar.']],
    faq: [['A avaliação é paga?', 'A primeira avaliação é gratuita. A limpeza e os exames têm valores informados antes do atendimento.'], ['Atendem convênio?', 'Atendemos alguns convênios para procedimentos preventivos. Consulte pelo WhatsApp.'], ['Atendem crianças?', 'Sim, a partir dos 6 anos, com profissional de odontopediatria às terças e quintas.']] }
];

const TEAM = [
  ['helena', 'Dra. Helena Vasconcelos', 'Implantodontia e prótese · Diretora clínica', 'Especialista em implantodontia e mestre em prótese. Fundou a Orla em 2010.'],
  ['rafael', 'Dr. Rafael Moura', 'Ortodontia e alinhadores', 'Ortodontista com foco em alinhadores transparentes e planejamento digital.'],
  ['camila', 'Dra. Camila Araújo', 'Estética, clareamento e lentes', 'Dentística restauradora. Cuida das lentes de contato e dos clareamentos.']
];

const POSTS = [
  { slug: 'protocolo-ou-dentadura', img: 'protocolo', cat: 'Protocolo', data: '4 de novembro de 2026', min: 5,
    titulo: 'Prótese protocolo ou dentadura: o que muda no dia a dia',
    resumo: 'As duas repõem todos os dentes, mas a rotina de quem usa cada uma é bem diferente. Veja o que muda para comer, falar e sorrir.',
    corpo: [['p', 'Quem perdeu todos os dentes de uma arcada tem hoje dois caminhos principais: a dentadura, que se apoia na gengiva, e a prótese protocolo, parafusada sobre implantes. As duas devolvem o sorriso. A diferença aparece no dia a dia.'], ['h', 'Para comer'], ['p', 'A dentadura se move durante a mastigação e reduz bastante a força da mordida. Por isso muita gente abandona carnes, frutas duras e castanhas. O protocolo é fixo: a força volta a níveis próximos dos dentes naturais e o cardápio deixa de ser uma preocupação.'], ['h', 'Para falar e sorrir'], ['p', 'A dentadura superior cobre o céu da boca, o que altera o paladar e pode atrapalhar a fala. O protocolo deixa o palato livre. E como não se solta, acaba o receio de a prótese sair do lugar em uma risada.'], ['h', 'Para o osso'], ['p', 'Sem raiz, o osso da mandíbula reabsorve ano após ano. É por isso que a dentadura vai ficando frouxa e precisa de reembasamento. Os implantes transmitem carga ao osso e freiam essa perda.'], ['n', 'Em resumo: a dentadura custa menos no início. O protocolo custa mais, mas devolve firmeza, paladar e segurança. A avaliação com tomografia mostra se você pode fazer e quantos implantes seriam necessários.']] },
  { slug: 'alinhadores-funcionam-para-todos', img: 'alinhador', cat: 'Alinhadores', data: '21 de outubro de 2026', min: 4,
    titulo: 'Alinhadores invisíveis funcionam para todos os casos?',
    resumo: 'Na maioria das vezes, sim. Entenda quando os alinhadores são a melhor escolha e quando o aparelho fixo ainda leva vantagem.',
    corpo: [['p', 'Os alinhadores evoluíram muito. Hoje tratam apinhamento, espaços, mordida cruzada e vários casos que há alguns anos só o aparelho fixo resolvia. Mesmo assim, não são a resposta para tudo.'], ['h', 'Quando funcionam muito bem'], ['p', 'Dentes tortos de grau leve a moderado, espaços entre os dentes e recidivas de quem já usou aparelho costumam ter resultado previsível e rápido, entre seis e doze meses.'], ['h', 'Quando pedem mais cuidado'], ['p', 'Rotações grandes, dentes muito inclinados e correções de mordida mais severas podem exigir recursos extras, como pequenos botões de resina nos dentes ou elásticos. Em alguns casos, combinar uma fase curta de aparelho fixo dá um resultado melhor.'], ['h', 'O fator que mais pesa: o uso'], ['p', 'O alinhador só funciona na boca. São 22 horas por dia, tirando apenas para comer e escovar. Quem não consegue manter essa disciplina tende a ter melhor resultado com o aparelho fixo.'], ['n', 'Na avaliação fazemos o escaneamento 3D e mostramos a simulação do seu caso. Se o alinhador não for a melhor opção, dizemos isso com clareza.']] },
  { slug: 'quanto-dura-o-clareamento', img: 'clareamento', cat: 'Clareamento', data: '7 de outubro de 2026', min: 3,
    titulo: 'Clareamento dental: quanto tempo dura o resultado?',
    resumo: 'O efeito dura de um a três anos. O que você come, bebe e como cuida dos dentes decide de que lado dessa faixa você fica.',
    corpo: [['p', 'O clareamento não é permanente, mas também não desaparece de uma hora para outra. Em média, o resultado se mantém de um a três anos, e uma sessão de manutenção costuma ser suficiente para recuperar o tom.'], ['h', 'O que faz a cor durar menos'], ['p', 'Café, chá preto, vinho tinto, açaí, molho shoyu e cigarro são os principais pigmentos. Não é preciso cortar nada: enxaguar a boca com água logo depois já ajuda bastante.'], ['h', 'O que faz durar mais'], ['p', 'Escovação caprichada, fio dental e limpeza profissional a cada seis meses. A limpeza remove as manchas superficiais antes que elas se fixem no esmalte.'], ['h', 'E a manutenção?'], ['p', 'Quem guarda as moldeiras pode fazer um reforço de poucos dias, com o gel indicado pelo dentista, uma vez por ano. É simples e bem mais barato que um clareamento completo.'], ['n', 'Importante: clareadores comprados na internet podem queimar a gengiva e causar sensibilidade intensa. Use apenas produtos indicados pelo seu dentista.']] }
];

const wa = (m) => `https://wa.me/${WA}?text=${encodeURIComponent(m)}`;
const img = (n, alt = '', extra = '') => `<img src='/img/${n}.webp' alt='${alt}' width='${TALL.includes(n) ? 880 : 1024}' height='${TALL.includes(n) ? 1168 : 688}' decoding='async' ${extra}>`;
const btn = (href, txt, cls = '') => `<a class='btn ${cls}' href='${href}'${href.startsWith('http') ? ` target='_blank' rel='noopener'` : ''}><span>${txt}</span><i>↗</i></a>`;
const LOGO = `<svg viewBox='0 0 40 40' aria-hidden='true'><circle cx='20' cy='20' r='20' fill='currentColor'/><path d='M8 19c4-3.4 8-3.4 12 0s8 3.4 12 0M8 26c4-3.4 8-3.4 12 0s8 3.4 12 0' stroke='#CFE6DC' stroke-width='2.4' fill='none' stroke-linecap='round'/></svg>`;
const NAV = [['/', 'Início'], ['/tratamentos', 'Tratamentos'], ['/sobre', 'Sobre'], ['/blog', 'Blog'], ['/contato', 'Contato']];
const WAICON = `<svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'><path d='M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z'/></svg>`;

const layout = ({ title, desc, path, body }) => `<!doctype html>
<html lang='pt-BR'>
<head>
<meta charset='utf-8'>
<meta name='viewport' content='width=device-width,initial-scale=1,viewport-fit=cover'>
<title>${title}</title>
<meta name='description' content='${desc}'>
<meta name='robots' content='noindex'>
<meta name='theme-color' content='#F4F3EF'>
<meta property='og:title' content='${title}'>
<meta property='og:description' content='${desc}'>
<meta property='og:image' content='/img/recepcao.webp'>
<link rel='icon' href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%230E3531'/%3E%3Cpath d='M8 19c4-3.4 8-3.4 12 0s8 3.4 12 0M8 26c4-3.4 8-3.4 12 0s8 3.4 12 0' stroke='%23CFE6DC' stroke-width='2.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E">
<link rel='preconnect' href='https://fonts.googleapis.com'>
<link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
<link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap'>
<link rel='stylesheet' href='/site.css'>
<script>document.documentElement.className='js'</script>
</head>
<body>
<header class='top'><div class='bar'>
<a class='logo' href='/' aria-label='Orla Odontologia'>${LOGO}<span>Orla <small>odontologia</small></span></a>
<nav class='nav' aria-label='Principal'>${NAV.map(([h, t]) => `<a href='${h}'${(h === '/' ? path === '/' : path.startsWith(h)) ? ` class='on' aria-current='page'` : ''}>${t}</a>`).join('')}</nav>
${btn('/contato', 'Agendar avaliação')}
<button class='burger' aria-label='Abrir menu' aria-expanded='false'></button>
</div></header>
<div class='menu'>${NAV.map(([h, t], i) => `<a href='${h}' style='--i:${i}'>${t}</a>`).join('')}<p>Av. das Marés, 1.450, Barra Nova, Rio de Janeiro<br>Seg a sex 8h às 19h · Sáb 9h às 14h</p></div>
<main>${body}</main>
<footer><div class='wrap'>
<div class='fgrid'>
<div><p class='fbig'>Seu sorriso começa com uma <em>conversa.</em></p><p style='margin-top:22px'>${btn('/contato', 'Agendar avaliação', 'light')}</p></div>
<div><h4>Tratamentos</h4><ul>${T.slice(0, 5).map((t) => `<li><a href='/tratamentos/${t.slug}'>${t.nome}</a></li>`).join('')}</ul></div>
<div><h4>Clínica</h4><ul><li><a href='/sobre'>Sobre a Orla</a></li><li><a href='/blog'>Blog</a></li><li><a href='/contato'>Contato</a></li><li><a href='/tratamentos'>Todos os tratamentos</a></li></ul></div>
<div><h4>Atendimento</h4><ul><li>(21) 3000-0000</li><li>contato@orlaodonto.exemplo</li><li>Seg a sex, 8h às 19h</li><li>Sábado, 9h às 14h</li></ul></div>
</div>
<div class='wordmark' aria-hidden='true'>Orla <em>odonto</em></div>
<div class='legal'><span>© 2026 Orla Odontologia · Resp. técnica: Dra. Helena Vasconcelos, CRO-RJ 00.000</span><span>Site de demonstração. Clínica, nomes, números e depoimentos são fictícios e as fotos foram geradas por IA.</span></div>
</div></footer>
<a class='wa' href='${wa('Olá! Vim pelo site da Orla Odontologia.')}' target='_blank' rel='noopener' aria-label='Falar pelo WhatsApp'>${WAICON}</a>
<script src='https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js'></script>
<script src='/site.js'></script>
</body></html>`;

const rise = (lines) => `<h1 class='rise'>${lines.map((l, i) => `<span><span style='--i:${i}'>${l}</span></span>`).join('')}</h1>`;
const head = (tag, h2, right = '') => `<div class='head'><div><span class='tag plain' data-r>${tag}</span><h2 data-r>${h2}</h2></div>${right}</div>`;
const faq = (items) => items.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('');
const cta = (h2, p, msg) => `<section class='cta'><div class='wrap'><div class='cta-in' data-par='70' data-r>${img('consulta', '', `loading='lazy'`)}<div><h2>${h2}</h2><p>${p}</p><div class='hero-ctas'>${btn(wa(msg), 'Chamar no WhatsApp', 'light')}${btn('/contato', 'Ver horários e endereço', 'ghost')}</div></div></div></div></section>`;
const tcard = (t, i) => `<a class='card' href='/tratamentos/${t.slug}' data-r style='--d:${(i % 3) * 0.1}s'><div class='media' style='view-transition-name:t-${t.slug}'>${img(t.img, t.nome, `loading='lazy'`)}<span class='go'>↗</span></div><h3>${t.nome}</h3><p>${t.curto}</p></a>`;
const pcard = (p, i) => `<a class='card' href='/blog/${p.slug}' data-r style='--d:${(i % 3) * 0.1}s'><div class='media' style='view-transition-name:b-${p.slug}'>${img(p.img, '', `loading='lazy'`)}<span class='go'>↗</span></div><div class='meta'><span>${p.cat}</span><span>${p.data} · ${p.min} min</span></div><h3>${p.titulo}</h3><p>${p.resumo}</p></a>`;
const team = () => `<div class='team'>${TEAM.map(([f, n, r, b], i) => `<article class='person' data-r style='--d:${i * 0.12}s'><div class='media'>${img(f, n, `loading='lazy'`)}</div><div><h3>${n}</h3><small>${r}</small></div><p>${b}</p></article>`).join('')}</div>`;
const QUOTES = [['Passei quinze anos de dentadura e tinha vergonha de sorrir em foto. Fiz o protocolo com a Dra. Helena e na sexta já estava almoçando com a família.', 'Marlene S.', 'Prótese protocolo'], ['Usei alinhadores por oito meses e ninguém no trabalho percebeu. O Dr. Rafael mostrou no computador como ia ficar, e ficou exatamente assim.', 'Thiago R.', 'Alinhadores'], ['Tenho pavor de dentista e fiz o implante com sedação sem sentir nada. Recepção atenciosa, ambiente calmo e tudo explicado com clareza.', 'Fernanda L.', 'Implante']];
const quotes = () => `<div class='quotes'>${QUOTES.map(([q, n, t], i) => `<figure class='quote' data-r style='--d:${i * 0.12}s'><div><div class='stars' aria-label='5 de 5 estrelas'>★★★★★</div><blockquote style='margin-top:18px'>${q}</blockquote></div><figcaption><span><b>${n}</b>Avaliação no Google</span><span>${t}</span></figcaption></figure>`).join('')}</div>`;
const phero = (crumbs, h1, lead) => `<section class='phero'><div class='wrap'><nav class='crumbs fade' style='--d:.1s' aria-label='Você está em'>${crumbs.map(([h, t]) => (h ? `<a href='${h}'>${t}</a><span>/</span>` : `<span>${t}</span>`)).join('')}</nav>${rise(h1)}${lead ? `<p class='lead fade' style='--d:.55s'>${lead}</p>` : ''}</div></section>`;

const pages = {};

pages['index.html'] = layout({ path: '/', title: 'Orla Odontologia · Implantes, protocolo e alinhadores na Barra', desc: 'Implantes, prótese protocolo, alinhadores invisíveis e clareamento, com planejamento digital e avaliação gratuita.', body: `
<section class='hero'><div class='wrap hero-grid'>
<div class='hero-copy'>
<span class='tag fade' style='--d:.1s'>Agenda aberta para novembro</span>
${rise(['O sorriso que', 'você <em>adiou,</em>', 'do jeito que', 'você <em>merece.</em>'])}
<p class='lead fade' style='--d:.6s'>Implantes, prótese protocolo e alinhadores com planejamento digital. Você vê o resultado na tela antes de decidir.</p>
<div class='hero-ctas fade' style='--d:.75s'>${btn('/contato', 'Agendar avaliação gratuita')}<a class='link' href='/tratamentos'>Ver tratamentos <span>↗</span></a></div>
<div class='proof fade' style='--d:.9s'><div class='avatars'>${TEAM.map(([f]) => img(f)).join('')}</div><span><b>4,9 de 5</b> em 412 avaliações no Google</span></div>
</div>
<div class='hero-visual fade' style='--d:.3s'>
<div class='media' data-par='60'>${img('hero', 'Paciente sorrindo', `fetchpriority='high'`)}</div>
<div class='float a'><b>72 horas</b>para dentes fixos<br>na prótese protocolo</div>
<div class='float b'><span class='stars'>★★★★★</span><b>16 anos</b>cuidando de sorrisos</div>
</div>
</div></section>

<div class='marquee' aria-hidden='true'>${[0, 1].map(() => `<div>${['Implantes', 'prótese protocolo', 'Alinhadores', 'clareamento', 'Lentes de contato', 'check-up digital'].map((w) => `<span>${w}</span>`).join('')}</div>`).join('')}</div>

<section class='statement'><div class='wrap'>
<p class='words'>Na Orla ninguém começa um tratamento sem ver o resultado antes. Planejamos o seu sorriso em 3D, explicamos cada etapa e cada valor por escrito, e só então começamos.</p>
<div class='stats'>
<div data-r><b><span data-count='2300'>2.300</span>+</b><span>implantes instalados desde 2010</span></div>
<div data-r style='--d:.1s'><b><span data-count='72'>72</span>h</b><span>para dentes fixos no protocolo</span></div>
<div data-r style='--d:.2s'><b><span data-count='9'>9</span></b><span>especialistas no mesmo endereço</span></div>
<div data-r style='--d:.3s'><b><span data-count='5'>5</span> anos</b><span>de garantia em implantes e próteses</span></div>
</div>
</div></section>

<section style='padding-top:0'><div class='wrap'>
${head('Tratamentos', 'Do primeiro implante ao sorriso <em>completo.</em>', `<a class='link' href='/tratamentos' data-r>Todos os tratamentos <span>↗</span></a>`)}
<div class='stack'>${T.slice(0, 4).map((t, i) => `<article class='stack-card' style='--i:${i}'><div class='stack-in' style='--bg:${t.bg};--fg:${t.fg}'>
<div class='stack-copy'><div><span class='n'>0${i + 1} / 04</span><h3>${t.nome}</h3><p>${t.lead}</p><div class='chips'>${t.fatos.map(([a, b]) => `<span>${b}</span>`).join('')}</div></div>${btn(`/tratamentos/${t.slug}`, 'Conhecer o tratamento', t.fg === '#F4F3EF' ? 'light' : '')}</div>
<a class='stack-img' href='/tratamentos/${t.slug}' tabindex='-1' aria-hidden='true' style='view-transition-name:t-${t.slug}'>${img(t.img, '', `loading='lazy'`)}</a>
</div></article>`).join('')}</div>
</div></section>

<section class='expand'><div class='expand-sticky'>
<div class='expand-media'>${img('recepcao', 'Recepção da clínica', `loading='lazy'`)}</div>
<div class='expand-copy'><h2>Um lugar para esquecer que você está <em>no dentista.</em></h2><p>Luz natural, vista para o mar e salas silenciosas. Tomografia, escaneamento e laboratório digital ficam aqui mesmo.</p>${btn('/sobre', 'Conhecer a clínica', 'light')}</div>
</div></section>

<section><div class='wrap'>
${head('Por que a Orla', 'Tecnologia de ponta, <em>conversa</em> sem pressa.')}
<ul class='feat'>
<li data-r><span class='n'>01</span><h3>Tudo em um só lugar</h3><p>Tomografia 3D, scanner intraoral e impressão dos guias cirúrgicos na própria clínica.</p></li>
<li data-r style='--d:.1s'><span class='n'>02</span><h3>Orçamento por escrito</h3><p>Cada etapa, cada prazo e cada valor no papel antes de qualquer procedimento.</p></li>
<li data-r style='--d:.2s'><span class='n'>03</span><h3>Sem medo</h3><p>Sedação consciente e anestesia computadorizada para quem tem receio de dentista.</p></li>
<li data-r style='--d:.3s'><span class='n'>04</span><h3>Fácil de chegar</h3><p>A dois minutos do metrô, com estacionamento no prédio e horários até as 19h.</p></li>
</ul>
</div></section>

<section style='padding-top:0'><div class='wrap'>
${head('Equipe', 'Quem cuida do seu <em>sorriso.</em>', `<a class='link' href='/sobre' data-r>Sobre a clínica <span>↗</span></a>`)}
${team()}
</div></section>

<section class='dark'><div class='wrap'>
${head('Depoimentos', 'Histórias que começaram com uma <em>avaliação.</em>')}
${quotes()}
</div></section>

<section><div class='wrap'>
${head('Blog', 'Para decidir com <em>informação.</em>', `<a class='link' href='/blog' data-r>Todos os artigos <span>↗</span></a>`)}
<div class='cards'>${POSTS.map(pcard).join('')}</div>
</div></section>
${cta('Vamos planejar o seu <em>sorriso?</em>', 'A avaliação é gratuita e inclui exame clínico, fotos e uma conversa sem pressa sobre as suas opções.', 'Olá! Gostaria de agendar uma avaliação na Orla Odontologia.')}` });

pages['tratamentos/index.html'] = layout({ path: '/tratamentos', title: 'Tratamentos · Orla Odontologia', desc: 'Implantes, prótese protocolo, alinhadores invisíveis, clareamento, lentes de contato dental e prevenção.', body: `
${phero([['/', 'Início'], ['', 'Tratamentos']], ['Tratamentos para', 'cada fase do', 'seu <em>sorriso.</em>'], 'Especialistas de cada área no mesmo endereço. Escolha um tratamento para ver como funciona, quanto tempo leva e para quem é indicado.')}
<section style='padding-top:clamp(20px,3vw,40px)'><div class='wrap'><div class='cards'>${T.map(tcard).join('')}</div></div></section>
<section class='dark'><div class='wrap split'>
<div><span class='tag plain' data-r style='background:transparent;border-color:rgba(255,255,255,.25)'>Como funciona</span><h2 data-r>Da primeira conversa ao <em>resultado.</em></h2><p class='lead' data-r>O caminho é o mesmo em qualquer tratamento, e você sabe em que etapa está o tempo todo.</p></div>
<ol class='steps'>${[['Avaliação gratuita', 'Exame clínico, fotos e conversa sobre o que você quer mudar.'], ['Diagnóstico digital', 'Tomografia e escaneamento 3D, quando o caso pede.'], ['Plano por escrito', 'Etapas, prazos e valores definidos antes de começar.'], ['Tratamento e acompanhamento', 'Você é atendido pelo especialista da área e volta para revisões programadas.']].map(([a, b], i) => `<li data-r><span class='n'>0${i + 1}</span><div><h3>${a}</h3><p>${b}</p></div></li>`).join('')}</ol>
</div></section>
${cta('Não sabe por onde <em>começar?</em>', 'Conte o que incomoda e a equipe indica o melhor caminho. A avaliação é gratuita.', 'Olá! Quero ajuda para escolher um tratamento.')}` });

T.forEach((t, k) => {
  const others = T.filter((x) => x !== t).slice(k % 2, (k % 2) + 3);
  pages[`tratamentos/${t.slug}/index.html`] = layout({ path: '/tratamentos', title: `${t.nome} · Orla Odontologia`, desc: t.curto, body: `
${phero([['/', 'Início'], ['/tratamentos', 'Tratamentos'], ['', t.nome]], t.nome.split(' ').length > 2 ? [t.nome.split(' ').slice(0, -2).join(' '), `<em>${t.nome.split(' ').slice(-2).join(' ')}</em>`] : [t.nome.split(' ')[0], `<em>${t.nome.split(' ').slice(1).join(' ')}</em>`], t.lead)}
<div class='wrap'>
<div class='media banner' data-par='80' style='view-transition-name:t-${t.slug}'>${img(t.img, t.nome, `fetchpriority='high'`)}</div>
<dl class='facts'>${t.fatos.map(([a, b]) => `<div data-r><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>
</div>
<section><div class='wrap split'>
<div><span class='tag plain' data-r>Indicação</span><h2 data-r>Para quem <em>é.</em></h2><p data-r>${btn(`/contato?t=${encodeURIComponent(t.nome)}`, 'Agendar avaliação')}</p></div>
<ul class='ticks'>${t.para.map((x) => `<li data-r>${x}</li>`).join('')}</ul>
</div></section>
<section class='dark'><div class='wrap split'>
<div><span class='tag plain' data-r style='background:transparent;border-color:rgba(255,255,255,.25)'>Passo a passo</span><h2 data-r>Como é o <em>tratamento.</em></h2></div>
<ol class='steps'>${t.etapas.map(([a, b], i) => `<li data-r><span class='n'>0${i + 1}</span><div><h3>${a}</h3><p>${b}</p></div></li>`).join('')}</ol>
</div></section>
<section><div class='wrap split'>
<div><span class='tag plain' data-r>Dúvidas</span><h2 data-r>Perguntas <em>frequentes.</em></h2><p class='muted' data-r>Não achou a sua? Mande pelo WhatsApp e respondemos no mesmo dia.</p></div>
<div data-r>${faq(t.faq)}</div>
</div></section>
<section style='padding-top:0'><div class='wrap'>${head('Outros tratamentos', 'Veja <em>também.</em>')}<div class='cards'>${others.map(tcard).join('')}</div></div></section>
${cta(`Vamos avaliar o seu <em>caso?</em>`, 'A primeira consulta é gratuita. Você sai com o diagnóstico e o plano de tratamento por escrito.', `Olá! Quero agendar uma avaliação de ${t.nome.toLowerCase()}.`)}` });
});

pages['sobre/index.html'] = layout({ path: '/sobre', title: 'Sobre · Orla Odontologia', desc: 'Conheça a história, a equipe e a estrutura da Orla Odontologia.', body: `
${phero([['/', 'Início'], ['', 'Sobre']], ['Odontologia com', 'tempo para <em>ouvir.</em>'], 'A Orla nasceu em 2010 com uma regra simples: nenhum paciente começa um tratamento sem entender cada etapa e cada valor.')}
<div class='wrap'><div class='two'><div class='media' data-r>${img('recepcao', 'Recepção')}</div><div class='media tall' data-r style='--d:.15s'>${img('sala', 'Sala de atendimento')}</div></div></div>
<section><div class='wrap split'>
<div><span class='tag plain' data-r>Nossa história</span><h2 data-r>De um consultório a uma clínica <em>completa.</em></h2></div>
<div class='prose' style='margin:0'><p data-r>A Dra. Helena Vasconcelos abriu a Orla em uma sala de 40 m², atendendo sozinha. O que trouxe os primeiros pacientes foi o hábito de desenhar o tratamento no papel e explicar por que cada passo existia.</p><p data-r>Dezesseis anos depois, somos nove especialistas, com tomografia, scanner intraoral e laboratório digital no mesmo andar. O papel virou tela, mas o hábito continua: você vê o resultado planejado antes de decidir.</p><p data-r>Atendemos de casos simples, como uma limpeza, a reabilitações completas com implantes. Em todos, o plano é entregue por escrito, com prazos e valores.</p></div>
</div></section>
<section style='padding-top:0'><div class='wrap'>
<div class='stats' style='margin-top:0'>
<div data-r><b><span data-count='16'>16</span></b><span>anos de clínica</span></div>
<div data-r style='--d:.1s'><b><span data-count='11400'>11.400</span></b><span>pacientes atendidos</span></div>
<div data-r style='--d:.2s'><b><span data-count='2300'>2.300</span>+</b><span>implantes instalados</span></div>
<div data-r style='--d:.3s'><b>4,9</b><span>de nota média no Google</span></div>
</div></div></section>
<section class='dark'><div class='wrap'>${head('Equipe', 'Especialistas em cada <em>área.</em>')}<div style='color:var(--paper)'>${team().replace(/<p>/g, `<p style='color:rgba(244,243,239,.66)'>`).replace(/<small>/g, `<small style='color:rgba(244,243,239,.6)'>`)}</div></div></section>
<section><div class='wrap'>${head('Estrutura', 'O que você encontra <em>aqui.</em>')}
<ul class='feat'>
<li data-r><span class='n'>01</span><h3>Tomografia 3D</h3><p>Exame feito na hora, com baixa dose de radiação.</p></li>
<li data-r style='--d:.1s'><span class='n'>02</span><h3>Scanner intraoral</h3><p>Moldagem digital em minutos, sem massa.</p></li>
<li data-r style='--d:.2s'><span class='n'>03</span><h3>Sedação consciente</h3><p>Conforto para cirurgias e para quem tem medo.</p></li>
<li data-r style='--d:.3s'><span class='n'>04</span><h3>Acessibilidade</h3><p>Elevador, banheiro adaptado e estacionamento.</p></li>
</ul></div></section>
${cta('Venha conhecer a <em>Orla.</em>', 'Agende uma visita ou uma avaliação gratuita. Será um prazer receber você.', 'Olá! Gostaria de conhecer a Orla Odontologia.')}` });

pages['blog/index.html'] = layout({ path: '/blog', title: 'Blog · Orla Odontologia', desc: 'Artigos da equipe da Orla sobre implantes, alinhadores, clareamento e saúde bucal.', body: `
${phero([['/', 'Início'], ['', 'Blog']], ['Para decidir com', '<em>informação.</em>'], 'Respostas diretas da nossa equipe para as dúvidas que mais ouvimos no consultório.')}
<section style='padding-top:clamp(20px,3vw,40px)'><div class='wrap'>
<a class='feature' href='/blog/${POSTS[0].slug}' data-r><div class='media' style='view-transition-name:b-${POSTS[0].slug}'>${img(POSTS[0].img, '')}</div><div><div class='card'><div class='meta'><span>${POSTS[0].cat}</span><span>${POSTS[0].data} · ${POSTS[0].min} min</span></div></div><h2>${POSTS[0].titulo}</h2><p class='muted'>${POSTS[0].resumo}</p><span class='link'>Ler artigo <span>↗</span></span></div></a>
<div class='cards two'>${POSTS.slice(1).map(pcard).join('')}</div>
</div></section>
${cta('Ficou com alguma <em>dúvida?</em>', 'Mande sua pergunta pelo WhatsApp. A equipe responde no mesmo dia, em horário comercial.', 'Olá! Tenho uma dúvida sobre um tratamento.')}` });

POSTS.forEach((p) => {
  pages[`blog/${p.slug}/index.html`] = layout({ path: '/blog', title: `${p.titulo} · Orla Odontologia`, desc: p.resumo, body: `
<section class='phero'><div class='wrap' style='max-width:980px'><nav class='crumbs fade' style='--d:.1s'><a href='/'>Início</a><span>/</span><a href='/blog'>Blog</a><span>/</span><span>${p.cat}</span></nav><h1 class='fade' style='--d:.2s;font-size:clamp(2.2rem,5.4vw,4.4rem);max-width:none'>${p.titulo}</h1><p class='muted fade' style='--d:.4s'>${p.data} · ${p.min} min de leitura · Equipe Orla</p></div></section>
<div class='wrap'><div class='media banner' data-par='80' style='view-transition-name:b-${p.slug}'>${img(p.img, '', `fetchpriority='high'`)}</div></div>
<section><div class='wrap'><article class='prose'><p class='lead' style='max-width:none;color:var(--ink)'>${p.resumo}</p>${p.corpo.map(([k, x]) => (k === 'h' ? `<h2 data-r>${x}</h2>` : k === 'n' ? `<p class='note' data-r>${x}</p>` : `<p data-r>${x}</p>`)).join('')}<p data-r>${btn('/contato', 'Agendar avaliação gratuita')}</p></article></div></section>
<section style='padding-top:0'><div class='wrap'>${head('Continue lendo', 'Outros <em>artigos.</em>')}<div class='cards two'>${POSTS.filter((x) => x !== p).map(pcard).join('')}</div></div></section>` });
});

pages['contato/index.html'] = layout({ path: '/contato', title: 'Contato e agendamento · Orla Odontologia', desc: 'Agende sua avaliação gratuita na Orla Odontologia. Endereço, horários e WhatsApp.', body: `
${phero([['/', 'Início'], ['', 'Contato']], ['Vamos <em>conversar?</em>'], 'Preencha o formulário e montamos a mensagem para você enviar pelo WhatsApp. Respondemos em até duas horas, em horário comercial.')}
<section style='padding-top:clamp(10px,2vw,30px)'><div class='wrap'>
<div class='contact'>
<dl class='info' data-r>
<div><dt>WhatsApp</dt><dd>(21) 3000-0000<small>Também para ligações</small></dd></div>
<div><dt>E-mail</dt><dd>contato@orlaodonto.exemplo</dd></div>
<div><dt>Endereço</dt><dd>Av. das Marés, 1.450, salas 501 a 504<small>Barra Nova, Rio de Janeiro, RJ</small></dd></div>
<div><dt>Horários</dt><dd>Seg a sex, 8h às 19h<small>Sábado, 9h às 14h</small><span class='open'>Aberto agora</span></dd></div>
<div><dt>Como chegar</dt><dd>2 min a pé do metrô<small>Estacionamento conveniado no prédio</small></dd></div>
</dl>
<form id='agendar' data-wa='${WA}' novalidate data-r style='--d:.15s'>
<h2>Agendar <em>avaliação</em></h2>
<div class='f2'><label for='nome'>Nome<input id='nome' name='nome' autocomplete='name' placeholder='Como podemos chamar você'></label><label for='tel'>WhatsApp<input id='tel' name='tel' inputmode='tel' autocomplete='tel' placeholder='(21) 9 0000-0000'></label></div>
<label for='trat'>Tratamento de interesse<select id='trat' name='trat'><option>Avaliação geral</option>${T.map((t) => `<option>${t.nome}</option>`).join('')}</select></label>
<fieldset><legend>Melhor período</legend><div class='opts'>${[['manha', 'de manhã', 'Manhã'], ['tarde', 'à tarde', 'Tarde'], ['noite', 'no início da noite', 'Início da noite'], ['sab', 'no sábado', 'Sábado']].map(([i, v, l], k) => `<input type='radio' name='periodo' id='p-${i}' value='${v}'${k === 1 ? ' checked' : ''}><label for='p-${i}'>${l}</label>`).join('')}</div></fieldset>
<label for='obs'>Conte um pouco, se quiser<textarea id='obs' name='obs' rows='2' placeholder='Ex.: uso dentadura em cima e quero algo fixo'></textarea></label>
<button class='btn' type='submit' style='justify-self:start'><span>Montar mensagem</span><i>↗</i></button>
<div class='msg' id='saida' hidden></div>
</form>
</div>
<div class='place' data-r><div class='media'>${img('recepcao', 'Recepção da Orla', `loading='lazy'`)}</div><div class='pin'><h3>Orla Odontologia</h3><p class='muted'>Av. das Marés, 1.450, 5º andar. Endereço fictício, usado apenas nesta demonstração.</p></div></div>
</div></section>
<section style='padding-top:0'><div class='wrap split'><div><span class='tag plain' data-r>Antes de agendar</span><h2 data-r>Dúvidas <em>comuns.</em></h2></div><div data-r>${faq([['Quanto custa a avaliação?', 'A primeira avaliação é gratuita e inclui exame clínico e fotos. Se o caso pedir tomografia, ela é feita na clínica e o valor é abatido do tratamento.'], ['Quais as formas de pagamento?', 'Pix, débito, cartão de crédito em até 12 vezes sem juros e financiamento próprio para reabilitações.'], ['Atendem urgências?', 'Sim. Pacientes em tratamento têm atendimento de urgência por WhatsApp, inclusive aos domingos.'], ['Preciso levar exames?', 'Se você tiver radiografias ou tomografias recentes, traga. Se não tiver, fazemos o que for necessário aqui.']])}</div></div></section>` });

pages['404.html'] = layout({ path: '/404', title: 'Página não encontrada · Orla Odontologia', desc: 'Página não encontrada.', body: `${phero([['/', 'Início'], ['', 'Erro 404']], ['Esta página', 'não <em>existe.</em>'], 'O endereço pode ter mudado. Volte ao início ou veja os tratamentos.')}<section style='padding-top:0'><div class='wrap hero-ctas'>${btn('/', 'Voltar ao início')}${btn('/tratamentos', 'Ver tratamentos', 'ghost')}</div></section>` });

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(`${OUT}/img`, { recursive: true });
for (const [name, id] of Object.entries(IMGS)) {
  let src;
  if (process.env.ORLA_LOCAL) {
    const tall = TALL.includes(name);
    src = await sharp({ create: { width: tall ? 880 : 1024, height: tall ? 1168 : 688, channels: 3, background: { r: 150 + (name.length * 7) % 60, g: 180, b: 165 } } }).png().toBuffer();
  } else {
    const res = await fetch(`${CDN}${id}.png`);
    if (!res.ok) throw new Error(`Falha ao baixar a foto ${name}: ${res.status}`);
    src = Buffer.from(await res.arrayBuffer());
  }
  await sharp(src).webp({ quality: 82 }).toFile(`${OUT}/img/${name}.webp`);
}
for (const [file, html] of Object.entries(pages)) {
  const dir = `${OUT}/${file}`.split('/').slice(0, -1).join('/');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(`${OUT}/${file}`, html);
}
await fs.copyFile('site.css', `${OUT}/site.css`);
await fs.copyFile('site.js', `${OUT}/site.js`);
console.log(`Site gerado: ${Object.keys(pages).length} páginas`);
