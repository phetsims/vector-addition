// Copyright 2019, University of Colorado Boulder

/**
 * Factory for creating the various icons that appear in the sim.
 *
 * ## Creates the following icons (annotated in the file):
 *  1. Screen icons
 *  2. Vector Creator Panel icons
 *  3. Checkbox icons (i.e. sum icon, angle icon, grid icon)
 *  4. Component Style Icons
 *  5. Coordinate Snap Mode Icons (polar and cartesian)
 *  6. Graph Orientation icons (horizontal and vertical - on the 'Explore 1D' screen)
 *  7. Equation Type icons (On the 'Equation' Screen)
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Color = require( 'SCENERY/util/Color' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CurvedArrowNode = require( 'VECTOR_ADDITION/common/view/CurvedArrowNode' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const interleave = require( 'PHET_CORE/interleave' );
  const Line = require( 'SCENERY/nodes/Line' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Screen = require( 'JOIST/Screen' );
  const ScreenIcon = require( 'JOIST/ScreenIcon' );
  const Shape = require( 'KITE/Shape' );
  const Spacer = require( 'SCENERY/nodes/Spacer' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorColorPalette = require( 'VECTOR_ADDITION/common/model/VectorColorPalette' );
  const VectorSymbolNode = require( 'VECTOR_ADDITION/common/view/VectorSymbolNode' );

  //----------------------------------------------------------------------------------------
  // constants

  // Defaults for the screen icons
  const SCREEN_ICON_WIDTH = 70;
  const SCREEN_ICON_HEIGHT = SCREEN_ICON_WIDTH / Screen.HOME_SCREEN_ICON_ASPECT_RATIO; // w/h = ratio <=> h = w/ratio

  // Defaults constants for radio button icons (except for the equation types radio button icons)
  // size (width and height) of all arrow nodes inside of radio buttons
  const RADIO_BUTTON_VECTOR_OPTIONS = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.fill,
    stroke: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.stroke
  } );
  const RADIO_BUTTON_COMPONENT_VECTOR_OPTIONS = _.extend( {}, VectorAdditionConstants.COMPONENT_VECTOR_OPTIONS, {
    fill: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.componentFill,
    stroke: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.componentStroke
  } );
  const RADIO_BUTTON_ICON_SIZE = 45;

  //----------------------------------------------------------------------------------------
  // Uses and Object literal so no instance is required

  const VectorAdditionIconFactory = {

    //========================================================================================
    // 1. Screen Icons (https://github.com/phetsims/vector-addition/issues/76)
    //========================================================================================

    /**
     * Creates the icon for the 'Explore 1D' Screen.
     * @public
     * @returns {ScreenIcon}
     */
    createExplore1DScreenIcon() {

      const vectorOptions = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
        fill: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.fill,
        stroke: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.stroke
      } );

      // Vector pointing to the right, the full width of the icon
      const rightVectorNode = new ArrowNode( 0, 0, SCREEN_ICON_WIDTH, 0, vectorOptions );

      // Vector pointing to the left, partial width of the icon
      const leftVectorNode = new ArrowNode( 0.33 * SCREEN_ICON_WIDTH, 0, 0, 0, vectorOptions );

      const vBox = new VBox( {
        align: 'right',
        spacing: SCREEN_ICON_HEIGHT * 0.20,
        children: [ rightVectorNode, leftVectorNode ]
      } );

      return createScreenIcon( [ vBox ] );
    },

    /**
     * Creates the icon for the 'Explore 2D' Screen.
     * @public
     * @returns {ScreenIcon}
     */
    createExplore2DScreenIcon() {

      const vector = new Vector2( SCREEN_ICON_WIDTH, -SCREEN_ICON_HEIGHT * 0.8 );

      // vector
      const vectorNode = new ArrowNode( 0, 0, vector.x, vector.y,
        _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
          fill: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.fill,
          stroke: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.stroke
        } ) );
      
      // component vectors
      const componentOptions = _.extend( {}, VectorAdditionConstants.COMPONENT_VECTOR_OPTIONS, {
        fill: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.componentFill,
        stroke: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.componentStroke
      } );
      const xComponentNode = new ArrowNode( 0, 0, vector.x, 0, componentOptions );
      const yComponentNode = new ArrowNode( vector.x, 0, vector.x, vector.y, componentOptions );

      return createScreenIcon( [ xComponentNode, yComponentNode, vectorNode ] );
    },

    /**
     * Creates the icon for the 'Lab' Screen.
     * @public
     * @returns {ScreenIcon}
     */
    createLabScreenIcon() {

      // {Vector2[]} the tip locations of the group 1 (blue) arrows (aligned tip to tail)
      const group1TipLocations = [
        new Vector2( SCREEN_ICON_WIDTH * 0.63, 0 ),
        new Vector2( SCREEN_ICON_WIDTH, -SCREEN_ICON_HEIGHT )
      ];

      // {Vector2[]} the tip locations of the group 2 (red) arrows (aligned tip to tail)
      const group2TipLocations = [
        new Vector2( 0, -SCREEN_ICON_HEIGHT * 0.7 ),
        new Vector2( SCREEN_ICON_WIDTH, -SCREEN_ICON_HEIGHT )
      ];

      // starting tail location of 1st vector
      const startingTailLocation = new Vector2( SCREEN_ICON_WIDTH / 4, 0 );

      const group1ArrowNodes = createTipToTailArrowNodes( group1TipLocations, startingTailLocation,
        _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
          fill: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.fill,
          stroke: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.stroke
        } ) );

      const group2ArrowNodes = createTipToTailArrowNodes( group2TipLocations, startingTailLocation,
        _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
          fill: VectorAdditionColors.VECTOR_COLOR_PALETTE_2.fill,
          stroke: VectorAdditionColors.VECTOR_COLOR_PALETTE_2.stroke
        } ) );

      return createScreenIcon( group2ArrowNodes.concat( group1ArrowNodes ) );
    },

    /**
     * Creates the icon for the 'Equation' Screen.
     * @public
     * @returns {ScreenIcon}
     */
    createEquationScreenIcon() {

      // {Vector2[]} the tip locations of the vectors on the icon (vectors are aligned tip to tail)
      const tipLocations = [
        new Vector2( SCREEN_ICON_WIDTH * 0.15, -SCREEN_ICON_HEIGHT * 0.75 ),
        new Vector2( SCREEN_ICON_WIDTH * 0.85, -SCREEN_ICON_HEIGHT )
      ];
      const startTail = Vector2.ZERO;
      const lastTip = _.last( tipLocations );

      // vectors, tip to tail
      const arrowNodes = createTipToTailArrowNodes( tipLocations, startTail,
        _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
          fill: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.fill,
          stroke: VectorAdditionColors.VECTOR_COLOR_PALETTE_1.stroke
        } ) );

      // sum
      arrowNodes.push( new ArrowNode( startTail.x, startTail.y, lastTip.x, lastTip.y,
        _.extend( {}, VectorAdditionConstants.SUM_VECTOR_OPTIONS, {
          fill: VectorAdditionColors.EQUATION_SUM_FILL,
          stroke: VectorAdditionColors.EQUATION_SUM_STROKE
        } ) ) );
      
      return createScreenIcon( arrowNodes );
    },

    //========================================================================================
    // 2. Vector Creator Panel Icon
    //========================================================================================

    /**
     * @public
     * @param {Vector2} initialVectorComponents - vector components (in view coordinates)
     * @param {VectorColorPalette} vectorColorPalette - color palette for this icon's vector
     * @param {number} arrowLength
     * @returns {Node}
     */
    createVectorCreatorPanelIcon( initialVectorComponents, vectorColorPalette, arrowLength ) {

      assert && assert( initialVectorComponents instanceof Vector2 );
      assert && assert( vectorColorPalette instanceof VectorColorPalette );
      assert && assert( typeof arrowLength === 'number' );

      const arrowComponents = initialVectorComponents.normalized().timesScalar( arrowLength );

      return new ArrowNode( 0, 0, arrowComponents.x, arrowComponents.y,
        _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
          arrowLength: arrowLength,
          cursor: 'pointer',
          fill: vectorColorPalette.fill,
          stroke: vectorColorPalette.stroke
        } ) );
    },

    //========================================================================================
    // 3. Checkbox icons (i.e. sum icon, angle icon)
    //========================================================================================

    /**
     * Creates a vector icon that points to the right, used with various checkboxes.
     * @public
     * @param {Color|string|null} fill
     * @param {Color|string|null} stroke
     * @returns {Node}
     */
    createVectorIcon: ( fill, stroke ) => {

      assert && assert( fill || stroke );

      return new ArrowNode( 0, 0, 22, 0, _.extend( {}, VectorAdditionConstants.SUM_VECTOR_OPTIONS, {
        fill: fill,
        stroke: stroke
      } ) );
    },

    /**
     * Creates the icon that appears next to the checkbox that toggles the 'Angle' visibility
     * @public
     * @returns {Node}
     */
    createAngleIcon() {
      
      // values determined empirically
      const wedgeLength = 20;
      const angle = Util.toRadians( 50 );
      const curvedArrowRadius = 16;

      const wedgeShape = new Shape()
        .moveTo( wedgeLength, 0 )
        .horizontalLineTo( 0 )
        .lineTo( Math.cos( angle ) * wedgeLength, -Math.sin( angle ) * wedgeLength );

      return new Node().setChildren( [
        new Path( wedgeShape, { stroke: Color.BLACK } ),
        new CurvedArrowNode( curvedArrowRadius, angle )
      ] );
    },

    //========================================================================================
    // 4. Component Style Radio Button Icons
    //========================================================================================

    /**
     * Creates the icons that go on the Component Style Radio Button based on a component style
     * @public
     * @param {ComponentStyles} componentStyle
     * @returns {Node}
     */
    createComponentStyleRadioButtonIcon( componentStyle ) {

      assert && assert( ComponentStyles.includes( componentStyle ) );

      const iconSize = RADIO_BUTTON_ICON_SIZE; // size of the icon (square)

      if ( componentStyle === ComponentStyles.INVISIBLE ) {
        return createEyeCloseIcon( iconSize );
      }

      const subBoxSize = RADIO_BUTTON_ICON_SIZE / 3; // size of the sub-box the arrow/on-axis lines creates
      assert && assert( subBoxSize < iconSize );

      // Initialize arrow nodes for the PARALLELOGRAM component style (will be adjusted for different component styles)
      const vectorArrow = new ArrowNode( 0, 0, iconSize, -iconSize, RADIO_BUTTON_VECTOR_OPTIONS );
      const xComponentArrow = new ArrowNode( 0, 0, iconSize, 0, RADIO_BUTTON_COMPONENT_VECTOR_OPTIONS );
      const yComponentArrow = new ArrowNode( 0, 0, 0, -iconSize, RADIO_BUTTON_COMPONENT_VECTOR_OPTIONS );

      let iconChildren = [ xComponentArrow, yComponentArrow, vectorArrow ]; // children of the icon children

      if ( componentStyle === ComponentStyles.TRIANGLE ) {
        yComponentArrow.setTailAndTip( iconSize, 0, iconSize, -iconSize );
      }
      else if ( componentStyle === ComponentStyles.ON_AXIS ) {
        vectorArrow.setTailAndTip( subBoxSize, -subBoxSize, iconSize, -iconSize );
        xComponentArrow.setTailAndTip( subBoxSize, 0, iconSize, 0 );
        yComponentArrow.setTailAndTip( 0, -subBoxSize, 0, -iconSize );

        // Create the on-axis lines
        const dashedLineShape = new Shape().moveTo( 0, -subBoxSize )
          .horizontalLineTo( subBoxSize )
          .verticalLineToRelative( subBoxSize )
          .moveTo( 0, -iconSize )
          .horizontalLineTo( iconSize )
          .verticalLineToRelative( iconSize );

        const dashedLinePath = new Path( dashedLineShape, {
          lineDash: [ 2.9, 2 ],
          stroke: 'black'
        } );

        iconChildren = [ dashedLinePath, xComponentArrow, yComponentArrow, vectorArrow ];
      }

      return new Node( {
        children: iconChildren,
        maxWidth: iconSize,
        maxHeight: iconSize
      } );
    },

    //========================================================================================
    // 5. Coordinate Snap Mode Icons (polar/cartesian, see https://github.com/phetsims/vector-addition/issues/21)
    //========================================================================================

    /**
     * Creates the icon for the Cartesian snap mode radio button.
     * @returns {Node}
     */
    createCartesianSnapModeIcon() {

      const iconSize = RADIO_BUTTON_ICON_SIZE;

      // Arrow that is 45 degrees to the right and up
      const vectorNode = new ArrowNode( 0, 0, iconSize, -iconSize, _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
        fill: RADIO_BUTTON_VECTOR_OPTIONS.fill
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
     * Creates the icon for the Polar snap mode radio button.
     * @returns {Node}
     */
    createPolarSnapModeIcon() {

      const iconSize = RADIO_BUTTON_ICON_SIZE;
      const arcRadius = 30; // arc radius of the curved arrow

      // Arrow that is 45 degrees to the right and up
      const arrow = new ArrowNode( 0, 0, iconSize, -iconSize, _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
        fill: VectorAdditionColors.VECTOR_COLOR_PALETTE_3.fill
      } ) );

      // Curved arrow that indicates the angle
      const curvedArrow = new CurvedArrowNode( arcRadius, Util.toRadians( 45 ) );

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

    //========================================================================================
    // 6. Graph Orientation Icons (horizontal/vertical)
    //========================================================================================

    /**
     * Creates the icon used on the radio buttons on 'Explore 1D' screen that toggles the graph orientation.
     * @public
     * @param {GraphOrientations} graphOrientation - orientation of the graph (has to be horizontal or vertical)
     * @returns {Node}
     */
    createGraphOrientationIcon( graphOrientation ) {

      assert && assert( _.includes( [ GraphOrientations.HORIZONTAL, GraphOrientations.VERTICAL ], graphOrientation ) );

      const iconSize = RADIO_BUTTON_ICON_SIZE;
      const tipX = ( graphOrientation === GraphOrientations.HORIZONTAL ) ? iconSize : 0;
      const tipY = ( graphOrientation === GraphOrientations.HORIZONTAL ) ? 0 : iconSize;

      return new ArrowNode( 0, 0, tipX, tipY, _.extend( {}, VectorAdditionConstants.AXES_ARROW_OPTIONS, {
        maxWidth: iconSize,
        maxHeight: iconSize
      } ) );
    },

    //========================================================================================
    // 7. Equation Types Icons
    //========================================================================================

    /**
     * Creates the Icon that appears on the Equation Types radio button icons on the 'Equation' screen.
     * @public
     * @param {EquationTypes} equationType
     * @param {string[]} vectorSymbols - symbols on the buttons (the last symbol is the sum's symbol)
     * @returns {Node}
     */
    createEquationTypeIcon( equationType, vectorSymbols ) {

      assert && assert( EquationTypes.includes( equationType ), `invalid equationType: ${equationType}` );
      assert && assert( _.every( vectorSymbols, symbol => typeof symbol === 'string' ) && vectorSymbols.length > 1 );

      let children = [];

      const textOptions = {
        font: new PhetFont( 18 )
      };

      // Gather all the symbols for the left side of the equation into an array.
      // For NEGATION, all symbols are on the left side of the equation)
      const equationLeftSideSymbols = _.dropRight( vectorSymbols, equationType === EquationTypes.NEGATION ? 0 : 1 );

      // Create a vector symbol for each symbol on the left side of the equation.
      equationLeftSideSymbols.forEach( symbol => {
        children.push( new VectorSymbolNode( symbol, null, false ) );
      } );

      // Interleave operators (i.e. '+'|'-') in between each symbol on the left side of the equation
      children = interleave( children, () => {
        return new Text( equationType === EquationTypes.SUBTRACTION ? MathSymbols.MINUS : MathSymbols.PLUS, textOptions );
      } );

      // '='
      children.push( new Text( MathSymbols.EQUAL_TO, textOptions ) );
      
      // Right side of the equation, which is either '0' or the last of the symbols (which is the sum).
      children.push( equationType === EquationTypes.NEGATION ?
                     new Text( '0', textOptions ) :
                     new VectorSymbolNode( _.last( vectorSymbols ), null, false ) );

      return new HBox( {
        children: children,
        spacing: 8
      } );
    }
  };

  //========================================================================================
  // Helper functions
  //========================================================================================

  /**
   * Creates Vector Icons (ArrowNode) tip to tail based on an array of tip locations along the tail location of the
   * first Vector. ArrowNodes are created and pushed to a given array.
   *
   * @param {Vector2[]} tipLocations - tip locations of all vectors (vectors are aligned tip to tail)
   * @param {Vector2} startingTailLocation - tail location of the first vector
   * @param {Object} [arrowOptions] - passed to arrow nodes
   * @returns {ArrowNode[]}
   */
  function createTipToTailArrowNodes( tipLocations, startingTailLocation, arrowOptions ) {

    assert && assert( _.every( tipLocations, tip => tip instanceof Vector2 ) );
    assert && assert( startingTailLocation instanceof Vector2 );

    const arrowNodes = [];
    for ( let i = 0; i < tipLocations.length; i++ ) {
      const tailLocation = i === 0 ? startingTailLocation : tipLocations[ i - 1 ];
      const tipLocation = tipLocations[ i ];
      arrowNodes.push( new ArrowNode( tailLocation.x, tailLocation.y, tipLocation.x, tipLocation.y, arrowOptions ) );
    }
    return arrowNodes;
  }

  /**
   * See https://github.com/phetsims/vector-addition/issues/76#issuecomment-515197547 for context.
   * Helper function that creates a ScreenIcon but adds a Spacer to fill extra space. This ensures all screen icons are
   * the same width and height which ensures that they are all scaled the same. Thus, this keeps all Arrow Nodes inside
   * of screen icons the same 'dimensions' (i.e. tailWidth, headWidth, headHeight, etc. ).
   *
   * @param {Node[]} children - the children of the icon
   * @returns {ScreenIcon}
   */
  function createScreenIcon( children ) {

    assert && assert( _.every( children, child => child instanceof Node ), `invalid children: ${children}` );

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
   * Create the close eye icon, for ComponentStyles.INVISIBLE.
   * @param {number} iconSize
   * @returns {Node}
   */
  function createEyeCloseIcon( iconSize ) {

    const spacer = new Spacer( iconSize, iconSize );

    const eyeIcon = new FontAwesomeNode( 'eye_close', {
      scale: 0.85, // determined empirically
      center: spacer.center
    } );

    return new Node( {
      children: [ spacer, eyeIcon ],
      maxWidth: iconSize,
      maxHeight: iconSize
    } );
  }

  return vectorAddition.register( 'VectorAdditionIconFactory', VectorAdditionIconFactory );
} );