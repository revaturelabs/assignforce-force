/************************
	Revature Fonts
************************/
/*Testing Code*/
* {
   font-family: Futura-Std-Book !important;
	src: URL('/resource/FuturaStdBook');
}

.boxLabel, .boxLabel > * {
    color: Black !important;
}

@font-face {
    font-family: 'Futura-Std-Book';
    src: URL('/resource/FuturaStdBook');
}

/************************
	Revature Colors #F26925
************************/
:root {
	/*** Primary Colors ***/ 
	--orange: #F26925; 
	--white: #FFFFFF; 
	--dark-grey: #474C55;
	/*** Secondary Colors ***/ 
	--blue: #72A4C2; 
	--yellow: #FCB414; 
	--light-grey: #B9B9BA;
}

/************************
	Base Styles
************************/
body {
    font-family: 'Futura-Std-Book';
    color: var(--dark-grey)
}
        
h1, h2, h3 {
    font-family: 'Futura-Std-Book';
}

.slds-card__header {
    background-color: var(--dark-grey);
	border-color: var(--dark-grey);
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
}
                
.flexipageHeader.slds-page-header.uiBlock.oneAnchorHeader{
	display:none
}
                
