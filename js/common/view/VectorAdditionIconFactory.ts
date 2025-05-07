// Copyright 2019-2025, University of Colorado Boulder

/**
 * Factory for creating the various icons that appear in the sim.
 *
 * ## Creates the following icons (annotated in the file):
 *  1. Screen icons
 *  2. Vector Creator Panel icons
 *  3. Checkbox icons (i.e. sum icon, angle icon, grid icon)
 *  4. Component Style Icons
 *  5. Coordinate Snap Mode Icons (polar and Cartesian)
 *  6. VectorAdditionScene Orientation icons (horizontal and vertical - on the 'Explore 1D' screen)
 *  7. Equation Type icons (On the 'Equations' Screen)
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Screen from '../../../../joist/js/Screen.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import Shape from '../../../../kite/js/Shape.js';
import interleave from '../../../../phet-core/js/interleave.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Spacer from '../../../../scenery/js/nodes/Spacer.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import eyeSlashSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSlashSolidShape.js';
import { EquationType } from '../../equations/model/EquationType.js';
import vectorAddition from '../../vectorAddition.js';
import { ComponentVectorStyle } from '../model/ComponentVectorStyle.js';
import { GraphOrientation } from '../model/GraphOrientation.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorAdditionColors from '../VectorAdditionColors.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ArrowOverSymbolNode from './ArrowOverSymbolNode.js';
import CurvedArrowNode from './CurvedArrowNode.js';
import DashedArrowNode, { DashedArrowNodeOptions } from './DashedArrowNode.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';

// constants
const SCREEN_ICON_WIDTH = 70;
const SCREEN_ICON_HEIGHT = SCREEN_ICON_WIDTH / Screen.HOME_SCREEN_ICON_ASPECT_RATIO; // w/h = ratio <=> h = w/ratio
const RADIO_BUTTON_ICON_SIZE = 45;

const VectorAdditionIconFactory = {

  //========================================================================================
  // Screen icons, see https://github.com/phetsims/vector-addition/issues/76
  //========================================================================================

  /**
   * Creates the icon for the 'Explore 1D' Screen.
   */
  createExplore1DScreenIcon(): ScreenIcon {

    const colorPalette = VectorAdditionColors.BLUE_COLOR_PALETTE;

    const arrowNodeOptions = combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
      fill: colorPalette.mainFill,
      stroke: colorPalette.mainStroke
    } );

    // Vector pointing to the right, the full width of the icon
    const rightVectorNode = new ArrowNode( 0, 0, SCREEN_ICON_WIDTH, 0, arrowNodeOptions );

    // Vector pointing to the left, partial width of the icon
    const leftVectorNode = new ArrowNode( 0.5 * SCREEN_ICON_WIDTH, 0, 0, 0, arrowNodeOptions );

    const vBox = new VBox( {
      align: 'right',
      spacing: SCREEN_ICON_HEIGHT * 0.20,
      children: [ rightVectorNode, leftVectorNode ]
    } );

    return createScreenIcon( [ vBox ] );
  },

  /**
   * Creates the icon for the 'Explore 2D' Screen.
   */
  createExplore2DScreenIcon(): ScreenIcon {

    const vector = new Vector2( SCREEN_ICON_WIDTH, -SCREEN_ICON_HEIGHT * 0.8 );
    const colorPalette = VectorAdditionColors.PINK_COLOR_PALETTE;

    // vector
    const vectorNode = new ArrowNode( 0, 0, vector.x, vector.y,
      combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
        fill: colorPalette.mainFill,
        stroke: colorPalette.mainStroke
      } ) );

    // component vectors
    const dashedArrowNodeOptions = combineOptions<DashedArrowNodeOptions>( {}, VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS, {
      fill: colorPalette.componentFill
    } );
    const xComponentNode = new DashedArrowNode( 0, 0, vector.x, 0, dashedArrowNodeOptions );
    const yComponentNode = new DashedArrowNode( vector.x, 0, vector.x, vector.y, dashedArrowNodeOptions );

    return createScreenIcon( [ xComponentNode, yComponentNode, vectorNode ] );
  },

  /**
   * Creates the icon for the 'Lab' Screen.
   */
  createLabScreenIcon(): ScreenIcon {

    // {Vector2[]} the tip positions of the group 1 (blue) arrows (aligned tip to tail)
    const group1TipPositions = [
      new Vector2( SCREEN_ICON_WIDTH * 0.63, 0 ),
      new Vector2( SCREEN_ICON_WIDTH, -SCREEN_ICON_HEIGHT )
    ];

    // {Vector2[]} the tip positions of the group 2 (orange) arrows (aligned tip to tail)
    const group2TipPositions = [
      new Vector2( 0, -SCREEN_ICON_HEIGHT * 0.7 ),
      new Vector2( SCREEN_ICON_WIDTH, -SCREEN_ICON_HEIGHT )
    ];

    // starting tail position of 1st vector
    const startingTailPosition = new Vector2( SCREEN_ICON_WIDTH / 4, 0 );

    const group1ArrowNodes = createTipToTailArrowNodes( group1TipPositions, startingTailPosition,
      combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
        fill: VectorAdditionColors.BLUE_COLOR_PALETTE.mainFill,
        stroke: VectorAdditionColors.BLUE_COLOR_PALETTE.mainStroke
      } ) );

    const group2ArrowNodes = createTipToTailArrowNodes( group2TipPositions, startingTailPosition,
      combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
        fill: VectorAdditionColors.ORANGE_COLOR_PALETTE.mainFill,
        stroke: VectorAdditionColors.ORANGE_COLOR_PALETTE.mainStroke
      } ) );

    return createScreenIcon( group2ArrowNodes.concat( group1ArrowNodes ) );
  },

  /**
   * Creates the icon for the 'Equations' Screen.
   */
  createEquationsScreenIcon(): ScreenIcon {

    // {Vector2[]} the tip positions of the vectors on the icon (vectors are aligned tip to tail)
    const tipPositions = [
      new Vector2( SCREEN_ICON_WIDTH * 0.15, -SCREEN_ICON_HEIGHT * 0.75 ),
      new Vector2( SCREEN_ICON_WIDTH * 0.85, -SCREEN_ICON_HEIGHT )
    ];
    const startTail = Vector2.ZERO;
    const lastTip = _.last( tipPositions )!;
    assert && assert( lastTip );

    const colorPalette = VectorAdditionColors.EQUATIONS_BLUE_COLOR_PALETTE;

    // vectors, tip to tail
    const arrowNodes = createTipToTailArrowNodes( tipPositions, startTail,
      combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
        fill: colorPalette.mainFill,
        stroke: colorPalette.mainStroke
      } ) );

    // sum
    arrowNodes.push( new ArrowNode( startTail.x, startTail.y, lastTip.x, lastTip.y,
      combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.SUM_VECTOR_ARROW_OPTIONS, {
        fill: colorPalette.sumFill,
        stroke: colorPalette.sumStroke
      } ) ) );

    return createScreenIcon( arrowNodes );
  },

  //========================================================================================
  // VectorCreatorPanel icons
  //========================================================================================

  /**
   * @param initialVectorComponents - vector components (in view coordinates)
   * @param vectorColorPalette - color palette for this icon's vector
   * @param arrowLength
   */
  createVectorCreatorPanelIcon( initialVectorComponents: Vector2, vectorColorPalette: VectorColorPalette, arrowLength: number ): Node {

    const arrowComponents = initialVectorComponents.normalized().timesScalar( arrowLength );

    return new ArrowNode( 0, 0, arrowComponents.x, arrowComponents.y,
      combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
        cursor: 'move',
        fill: vectorColorPalette.mainFill,
        stroke: vectorColorPalette.mainStroke
      } ) );
  },

  //========================================================================================
  // Checkbox icons (i.e. sum icon, angle icon)
  //========================================================================================

  /**
   * Creates a vector icon that points to the right, used with various checkboxes.
   */
  createVectorIcon( vectorLength: number, providedOptions?: ArrowNodeOptions ): Node {

    const options = combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
      fill: Color.BLACK,
      stroke: null,
      lineWidth: 1
    }, providedOptions );

    return new ArrowNode( 0, 0, vectorLength, 0, options );
  },

  /**
   * Creates the icon that appears next to the checkbox that toggles the 'Angle' visibility
   */
  createAngleIcon(): Node {

    // values determined empirically
    const wedgeLength = 20;
    const angle = toRadians( 50 );
    const curvedArrowRadius = 16;

    const wedgeShape = new Shape()
      .moveTo( wedgeLength, 0 )
      .horizontalLineTo( 0 )
      .lineTo( Math.cos( angle ) * wedgeLength, -Math.sin( angle ) * wedgeLength );
    const wedgeNode = new Path( wedgeShape, {
      stroke: Color.BLACK
    } );

    const curvedArrowNode = new CurvedArrowNode( curvedArrowRadius, angle );

    const thetaNode = new Text( MathSymbols.THETA, {
      font: VectorAdditionConstants.EQUATION_SYMBOL_FONT,
      scale: 0.75,
      left: curvedArrowNode.right + 4,
      centerY: wedgeNode.centerY
    } );

    return new Node( {
      children: [ wedgeNode, curvedArrowNode, thetaNode ]
    } );
  },

  //========================================================================================
  // ComponentVectorStyle icons, used on Component radio buttons
  //========================================================================================

  /**
   * Creates the icons that go on the Component Style Radio Button based on a component style
   */
  createComponentStyleRadioButtonIcon( componentVectorStyle: ComponentVectorStyle ): Node {

    const iconSize = RADIO_BUTTON_ICON_SIZE; // size of the icon (square)

    if ( componentVectorStyle === 'invisible' ) {
      return createEyeCloseIcon( iconSize );
    }

    const subBoxSize = RADIO_BUTTON_ICON_SIZE / 3; // size of the sub-box the leader lines create
    assert && assert( subBoxSize < iconSize, `subBoxSize ${subBoxSize} must be < iconSize ${iconSize}` );

    // Options for main (solid) and component (dashed) arrows
    const arrowNodeOptions = combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
      fill: VectorAdditionColors.BLUE_COLOR_PALETTE.mainFill,
      stroke: VectorAdditionColors.BLUE_COLOR_PALETTE.mainStroke
    } );
    const dashedArrowNodeOptions = combineOptions<DashedArrowNodeOptions>( {}, VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS, {
      fill: VectorAdditionColors.BLUE_COLOR_PALETTE.componentFill
    } );

    // Initialize arrows for the PARALLELOGRAM component style (will be adjusted for different component styles)
    const vectorArrow = new ArrowNode( 0, 0, iconSize, -iconSize, arrowNodeOptions );
    const xComponentArrow = new DashedArrowNode( 0, 0, iconSize, 0, dashedArrowNodeOptions );
    const yComponentArrow = new DashedArrowNode( 0, 0, 0, -iconSize, dashedArrowNodeOptions );

    let iconChildren: Node[] = [ xComponentArrow, yComponentArrow, vectorArrow ]; // children of the icon children

    if ( componentVectorStyle === 'triangle' ) {
      yComponentArrow.setTailAndTip( iconSize, 0, iconSize, -iconSize );
    }
    else if ( componentVectorStyle === 'projection' ) {
      vectorArrow.setTailAndTip( subBoxSize, -subBoxSize, iconSize, -iconSize );
      xComponentArrow.setTailAndTip( subBoxSize, 0, iconSize, 0 );
      yComponentArrow.setTailAndTip( 0, -subBoxSize, 0, -iconSize );

      // Create the leader lines
      const leaderLinesShape = new Shape().moveTo( 0, -subBoxSize )
        .horizontalLineTo( subBoxSize )
        .verticalLineToRelative( subBoxSize )
        .moveTo( 0, -iconSize )
        .horizontalLineTo( iconSize )
        .verticalLineToRelative( iconSize );

      const leaderLinesPath = new Path( leaderLinesShape, {
        lineDash: [ 2.9, 2 ],
        stroke: 'black'
      } );

      iconChildren = [ leaderLinesPath, xComponentArrow, yComponentArrow, vectorArrow ];
    }

    return new Node( {
      children: iconChildren,
      maxWidth: iconSize,
      maxHeight: iconSize
    } );
  },

  //=========================================================================================================
  // CoordinateSnapMode icons, used on scene radio buttons,
  // see https://github.com/phetsims/vector-addition/issues/21)
  //=========================================================================================================

  /**
   * Creates the icon for the Cartesian scene radio button.
   */
  createCartesianSceneIcon( vectorColorPalette: VectorColorPalette ): Node {

    const iconSize = RADIO_BUTTON_ICON_SIZE;

    // Arrow that is 45 degrees to the right and up
    const vectorNode = new ArrowNode( 0, 0, iconSize, -iconSize,
      combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
        fill: vectorColorPalette.mainFill,
        stroke: vectorColorPalette.mainStroke
      } ) );

    // x and y, Cartesian coordinates
    const xyArrowOptions = {
      fill: 'black',
      tailWidth: 1,
      headWidth: 6,
      headHeight: 6
    };
    const xNode = new ArrowNode( 0, 0, iconSize, 0, xyArrowOptions );
    const yNode = new ArrowNode( iconSize, 0, iconSize, -iconSize, xyArrowOptions );

    return new Node( {
      children: [ vectorNode, xNode, yNode ],
      maxWidth: iconSize,
      maxHeight: iconSize
    } );
  },

  /**
   * Creates the icon for the Polar scene radio button.
   */
  createPolarSceneIcon( vectorColorPalette: VectorColorPalette ): Node {

    const iconSize = RADIO_BUTTON_ICON_SIZE;
    const arcRadius = 30; // arc radius of the curved arrow

    // Arrow that is 45 degrees to the right and up
    const arrow = new ArrowNode( 0, 0, iconSize, -iconSize,
      combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.VECTOR_ARROW_OPTIONS, {
        fill: vectorColorPalette.mainFill,
        stroke: vectorColorPalette.mainStroke
      } ) );

    // Curved arrow that indicates the angle
    const curvedArrow = new CurvedArrowNode( arcRadius, toRadians( 45 ) );

    // horizontal line
    const line = new Line( 0, 0, iconSize, 0, {
      stroke: Color.BLACK
    } );

    return new Node( {
      children: [ arrow, curvedArrow, line ],
      maxWidth: iconSize,
      maxHeight: iconSize
    } );
  },

  //================================================================================================
  // GraphOrientation icons (horizontal/vertical), used on scene radio buttons in Explore 1D screen
  //================================================================================================

  /**
   * Creates the icon used on the radio buttons on 'Explore 1D' screen that toggles the graph orientation.
   */
  createGraphOrientationIcon( graphOrientation: GraphOrientation ): Node {

    assert && assert( _.includes( [ 'horizontal', 'vertical' ], graphOrientation ), `invalid graphOrientation: ${graphOrientation}` );

    const iconSize = RADIO_BUTTON_ICON_SIZE;
    const tipX = ( graphOrientation === 'horizontal' ) ? iconSize : 0;
    const tipY = ( graphOrientation === 'horizontal' ) ? 0 : iconSize;

    return new ArrowNode( 0, 0, tipX, tipY,
      combineOptions<ArrowNodeOptions>( {}, VectorAdditionConstants.AXES_ARROW_OPTIONS, {
        maxWidth: iconSize,
        maxHeight: iconSize
      } ) );
  },

  //========================================================================================
  // EquationType icons, used on radio buttons in Equations screen
  //========================================================================================

  /**
   * Creates the Icon that appears on the EquationType radio button icons on the 'Equations' screen.
   * @param equationType
   * @param vectorSymbolProperties - symbols on the buttons (the last symbol is the sum's symbol)
   */
  createEquationTypeIcon( equationType: EquationType, vectorSymbolProperties: TReadOnlyProperty<string>[] ): Node {

    let children: Node[] = [];

    const textOptions = {
      font: VectorAdditionConstants.EQUATION_FONT
    };

    // Gather all the symbols for the left side of the equation into an array.
    // For NEGATION, all symbols are on the left side of the equation
    const equationLeftSideSymbolProperties = _.dropRight( vectorSymbolProperties, equationType === 'negation' ? 0 : 1 );

    // Create a vector symbol for each symbol on the left side of the equation.
    equationLeftSideSymbolProperties.forEach( symbolProperty => {
      children.push( new ArrowOverSymbolNode( symbolProperty ) );
    } );

    // Interleave operators (i.e. '+'|'-') in between each symbol on the left side of the equation
    children = interleave( children, () => {
      const operator = ( equationType === 'subtraction' ) ? MathSymbols.MINUS : MathSymbols.PLUS;
      return new Text( operator, textOptions );
    } );

    // '='
    children.push( new Text( MathSymbols.EQUAL_TO, textOptions ) );

    // Right side of the equation, which is either '0' or the last of the symbols (which is the sum).
    children.push( equationType === 'negation' ?
                   new Text( '0', textOptions ) :
                   new ArrowOverSymbolNode( _.last( vectorSymbolProperties )! ) );

    return new HBox( {
      children: children,
      spacing: 8,
      align: 'origin' // so that text baselines are aligned
    } );
  }
};

//========================================================================================
// Helper functions
//========================================================================================

/**
 * Creates Vector Icons (ArrowNode) tip to tail based on an array of tip positions along with the tail position of the
 * first Vector. ArrowNodes are created and pushed to a given array.
 *
 * @param tipPositions - tip positions of all vectors (vectors are aligned tip to tail)
 * @param startingTailPosition - tail position of the first vector
 * @param [arrowNodeOptions] - passed to ArrowNode constructor
 */
function createTipToTailArrowNodes( tipPositions: Vector2[], startingTailPosition: Vector2, arrowNodeOptions?: ArrowNodeOptions ): ArrowNode[] {

  const arrowNodes = [];
  for ( let i = 0; i < tipPositions.length; i++ ) {
    const tailPosition = ( i === 0 ) ? startingTailPosition : tipPositions[ i - 1 ];
    const tipPosition = tipPositions[ i ];
    arrowNodes.push( new ArrowNode( tailPosition.x, tailPosition.y, tipPosition.x, tipPosition.y, arrowNodeOptions ) );
  }
  return arrowNodes;
}

/**
 * See https://github.com/phetsims/vector-addition/issues/76#issuecomment-515197547 for context.
 * Helper function that creates a ScreenIcon but adds a Spacer to fill extra space. This ensures all screen icons are
 * the same width and height which ensures that they are all scaled the same. Thus, this keeps all Arrow Nodes inside
 * of screen icons the same 'dimensions' (i.e. tailWidth, headWidth, headHeight, etc. ).
 */
function createScreenIcon( children: Node[] ): ScreenIcon {

  // Create the icon, adding a Spacer to fill extra space if needed (Equivalent to setting a minimum width/height)
  const iconNode = new Node().addChild( new Spacer( SCREEN_ICON_WIDTH, SCREEN_ICON_HEIGHT, { pickable: false } ) );

  iconNode.addChild( new Node( { // Wrap the icon content in a Node
    children: children,
    center: iconNode.center,
    maxWidth: SCREEN_ICON_WIDTH, // Ensures the icon doesn't get wider than the fixed screen icon dimensions
    maxHeight: SCREEN_ICON_HEIGHT // Ensures the icon doesn't get taller than the fixed screen icon dimensions
  } ) );

  return new ScreenIcon( iconNode );
}

/**
 * Create the close eye icon, for ComponentVectorStyle.INVISIBLE.
 */
function createEyeCloseIcon( iconSize: number ): Node {

  const spacer = new Spacer( iconSize, iconSize );

  const eyeIcon = new Path( eyeSlashSolidShape, {
    scale: 0.068, // determined empirically
    fill: 'black',
    center: spacer.center
  } );

  return new Node( {
    children: [ spacer, eyeIcon ],
    maxWidth: iconSize,
    maxHeight: iconSize
  } );
}

vectorAddition.register( 'VectorAdditionIconFactory', VectorAdditionIconFactory );
export default VectorAdditionIconFactory;