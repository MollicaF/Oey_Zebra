from numpy.random import normal
import numpy as np

NIMAGES = 50  # How many images you want

'''
TODO: 
    - Rotate the image box
    - Stroke-type option # stroke-dasharray="[#on, #off]*"
    - Stroke-width option # stroke-width="#"
    - Fill option # stroke="color" [fill="color"]
    - Color option stroke="color" fill="color"
'''

###########################
# Head and Footer SVG
###########################

header = '''<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="200px" height="200px" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" version="1.1">
<title>Example</title>
<desc>Just a stage</desc>
'''

footer = ''' stroke="black" stroke-width="5"/>
</svg>
'''

###########################
# Path Functions
###########################

#def path(sx, sy, rx, ry, tx, ty, fillCol="white", strokeCol="black", strokeWidth=5, pad=10, sd=5, convexSR=True, convexRT=True, convexTS=False):
def path(sx, sy, rx, ry, tx, ty, pad=10, sd=5, convexSR=True, convexRT=True, convexTS=False):

    """
    Implements a quadratic (aka symmetric) arc blob

    sx, sy    : (float) the platonic ideal of the top left point of the triangle
    rx, ry    : (float) the platonic ideal of the righ-tmost point of the triangle
    tx, ty    : (float) the platonic ideal of the bottom left point of the triangle
    pad       : (float) the convex offset off the triangle
    sd        : (float) the noise around the convex offset
    convexSR : (bool) should the arc between S and R be convex
    convexRT : (bool) should the arc between R and T be convex
    convexTS : (bool) should the arc between T and S be convex
    """
    # Initialize the path
    init = "<path d='M %s %s" % (sx, sy)

    # Sample the offset for the arcs
    adjSR = normal(pad, sd)
    adjRT = normal(pad, sd)
    adjTS = normal(pad, sd)
    jitter = normal(0, pad+sd)

    # Define the centers of the arcs
    if convexSR:
        srCenterX = (sx + (rx-sx)/2) + adjSR 
        srCenterY = (sy + (ry-sy)/2) - adjSR
    else:
        srCenterX = (sx + (rx-sx)/2) - adjSR 
        srCenterY = (sy + (ry-sy)/2) + adjSR

    if convexRT:
        rtCenterX = tx + (rx-tx)/2 + adjRT
        rtCenterY = ry + (ty-ry)/2 + adjRT
    else:
        rtCenterX = tx + (rx-tx)/2 - adjRT
        rtCenterY = ry + (ty-ry)/2 - adjRT

    if convexTS:
        tsCenterX = min(tx,sx) + abs(tx-sx)/2 - adjTS
        tsCenterY = sx + (tx-sx)/2 + jitter
    else:
        tsCenterX = min(tx,sx) + abs(tx-sx)/2 + adjTS
        tsCenterY = sx + (tx-sx)/2 + jitter

    # Write the path
    curveSR = "Q %s %s %s %s " % (srCenterX, srCenterY, rx, ry)
    curveRT = "Q %s %s %s %s " % (rtCenterX, rtCenterY, tx, ty)
    curveTS = "Q %s %s %s %s'" % (tsCenterX, tsCenterY, sx, sy)

    #fill = ''' fill=''' + fillCol
    #stroke = ''' stroke=''' + strokeCol
    #stroke_width = ''' stroke-width="''' + str(strokeWidth) + '''"'''

    #return header + init + curveSR + curveRT + curveTS + fill + stroke + stroke_width + footer
    return header + init + curveSR + curveRT + curveTS + footer


def bpath(sx, sy, rx, ry, tx, ty, ux, uy, fill, stroketype, pad=10, sd=5, convexSR=True, convexRT=True, convexTU=False, convexUS=False):
    """
    Implements a bezzier (aka non-symmetric) arc blob

    sx, sy    : (float) the platonic ideal of the top left point of the triangle
    rx, ry    : (float) the platonic ideal of the righ-tmost point of the triangle
    tx, ty    : (float) the platonic ideal of the bottom left point of the triangle
    pad       : (float) the convex offset off the triangle
    sd        : (float) the noise around the convex offset
    convexSR : (bool) should the arc between S and R be convex
    convexRT : (bool) should the arc between R and T be convex
    convexTS : (bool) should the arc between T and S be convex
    """
    # Initialize the path
    init = "<path d='M %s %s" % (sx, sy)

    # Sample the offset for the arcs
    adjSR = normal(pad, sd)
    adjRT = normal(pad, sd)
    adjTU = normal(pad, sd)
    adjUS = normal(pad, sd)
    jitter = normal(0, pad+sd)

    # Define the centers of the arcs
    if convexSR:
        srCenterX = (sx + (rx-sx)/2) + adjSR 
        srCenterY = (sy + (ry-sy)/2) - adjSR
    else:
        srCenterX = (sx + (rx-sx)/2) - adjSR 
        srCenterY = (sy + (ry-sy)/2) + adjSR

    # Sample the asymmetry of the center tangent
    beta = (ry-sy)/(rx-sx)
    moment = normal(pad/2, sd)
    srx1 = srCenterX - moment
    sry1 = srCenterY - (beta*moment)
    srx2 = srCenterX + moment
    sry2 = srCenterY + (beta*moment)

    # Define the centers of the arcs
    if convexRT:
        rtCenterX = tx + (rx-tx)/2 + adjRT
        rtCenterY = ry + (ty-ry)/2 + adjRT
    else:
        rtCenterX = tx + (rx-tx)/2 - adjRT
        rtCenterY = ry + (ty-ry)/2 - adjRT

    # Sample the asymmetry of the center tangent
    beta = (ry-ty)/(rx-tx)
    moment = normal(pad/2, sd)
    rtx1 = rtCenterX + moment
    rty1 = rtCenterY + (beta*moment)
    rtx2 = rtCenterX - moment
    rty2 = rtCenterY - (beta*moment)

    # Define the centers of the arcs
    if convexTU:
        tuCenterX = min(tx,ux) + abs(tx-ux)/2 - adjTU
        tuCenterY = ux + (tx-ux)/2 + jitter
    else:
        tuCenterX = min(tx,ux) + abs(tx-ux)/2 + adjTU
        tuCenterY = ux + (tx-ux)/2 + jitter

    # Sample the asymmetry of the center tangent
    beta = (ty-uy)/(tx-ux)
    moment = normal(pad/2, sd)
    tux1 = tuCenterX
    tuy1 = tuCenterY + moment
    tux2 = tuCenterX
    tuy2 = tuCenterY - moment

    # Define the centers of the arcs
    if convexUS:
        usCenterX = min(ux,sx) + abs(ux-sx)/2 - adjUS
        usCenterY = sx + (ux-sx)/2 + jitter
    else:
        usCenterX = min(ux,sx) + abs(ux-sx)/2 + adjUS
        usCenterY = sx + (ux-sx)/2 + jitter

    # Sample the asymmetry of the center tangent
    beta = (uy-sy)/(ux-sx)
    moment = normal(pad/2, sd)
    usx1 = usCenterX
    usy1 = usCenterY + moment
    usx2 = usCenterX
    usy2 = usCenterY - moment

    # Write the path
    curveSR = "C %s %s %s %s %s %s " % (srx1, sry1, srx2, sry2, rx, ry)
    curveRT = "C %s %s %s %s %s %s " % (rtx1, rty1, rtx2, rty2, tx, ty)
    curveTU = "C %s %s %s %s %s %s" % (tux1, tuy1, tux2, tuy2, ux, uy)
    curveUS = "C %s %s %s %s %s %s'" % (usx1, usy1, usx2, usy2, sx, sy)
    fillColor = " fill=\"" + fill + "\""
    strokedash = " stroke-dasharray=\"" + stroketype + "\"" 
    
    #print(header + init + curveSR + curveRT + curveTS + fill + footer)

    return header + init + curveSR + curveRT + curveTU + curveUS + fillColor + strokedash + footer


for i in range(NIMAGES):
    unif = np.random.uniform(0,2)
    if(unif < 1):
        SX = np.random.uniform(40,50)
        SY = np.random.uniform(30,50)
        RX = np.random.uniform(150,170)
        RY = np.random.uniform(50,75)
        TX = np.random.uniform(80,95)
        TY = np.random.uniform(125,170)
        UX = np.random.uniform(40,120)
        UY = np.random.uniform(60,80)
    else:
        SX = np.random.uniform(50,160)
        SY = np.random.uniform(40,50)
        RX = np.random.uniform(150,150)
        RY = np.random.uniform(75,170)
        TX = np.random.uniform(50,95)
        TY = np.random.uniform(125,160)
        UX = np.random.uniform(40,70)
        UY = np.random.uniform(70,80)

    #fill = "white" if normal(0, 1) < 0 else "black"
    fill = "white"
    
    pic = bpath(SX, SY, RX, RY, TX, TY, UX, UY, fill, stroketype="[0,0]", convexSR=True, convexRT=True, convexTU=True, convexUS=True)
    with open('Drawings/Exp1_NormingData_12_10_Unif/Draw_'+fill+'_'+str(i)+'.svg', 'w') as f:
        f.write(pic)


