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
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const CurvedArrowNode = require( 'VECTOR_ADDITION/common/view/CurvedArrowNode' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const interleave = require( 'PHET_CORE/interleave' );
  const Line = require( 'SCENERY/nodes/Line' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
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
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );
  const VectorSymbolNode = require( 'VECTOR_ADDITION/common/view/VectorSymbolNode' );

  //----------------------------------------------------------------------------------------
  // constants

  // Defaults for the screen icons
  const SCREEN_ICON_WIDTH = 70;
  const SCREEN_ICON_HEIGHT = SCREEN_ICON_WIDTH / Screen.HOME_SCREEN_ICON_ASPECT_RATIO; // w/h = ratio <=> h = w/ratio

  // Defaults constants for radio button icons (except for the equation types radio button icons)
  // size (width and height) of all arrow nodes inside of radio buttons
  const RADIO_BUTTON_VECTOR_OPTIONS = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors[ VectorColorGroups.COLOR_GROUP_1 ].fill
  } );
  const RADIO_BUTTON_COMPONENT_VECTOR_OPTIONS = _.extend( {}, VectorAdditionConstants.COMPONENT_VECTOR_OPTIONS, {
    fill: VectorAdditionColors[ VectorColorGroups.COLOR_GROUP_1 ].component
  } );
  const RADIO_BUTTON_TEXT_FONT = new PhetFont( {
    size: 11.5,
    family: 'Times',
    weight: '500'
  } );


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
        fill: VectorAdditionColors[ VectorColorGroups.COLOR_GROUP_1 ].fill
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
          fill: VectorAdditionColors[ VectorColorGroups.COLOR_GROUP_1 ].fill
        } ) );
      
      // component vectors
      const componentOptions = _.extend( {}, VectorAdditionConstants.COMPONENT_VECTOR_OPTIONS, {
        fill: VectorAdditionColors[ VectorColorGroups.COLOR_GROUP_1 ].component
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
          fill: VectorAdditionColors[ VectorColorGroups.COLOR_GROUP_1 ].fill
        } ) );

      const group2ArrowNodes = createTipToTailArrowNodes( group2TipLocations, startingTailLocation,
        _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
          fill: VectorAdditionColors[ VectorColorGroups.COLOR_GROUP_2 ].fill
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
          fill: VectorAdditionColors[ VectorColorGroups.COLOR_GROUP_1 ].fill
        } ) );

      // sum
      arrowNodes.push( new ArrowNode( startTail.x, startTail.y, lastTip.x, lastTip.y,
        _.extend( {}, VectorAdditionConstants.SUM_VECTOR_OPTIONS, {
          fill: VectorAdditionColors.EQUATION_SUM_FILL
        } ) ) );
      
      return createScreenIcon( arrowNodes );
    },

    //========================================================================================
    // 2. Vector Creator Panel Icon
    //========================================================================================

    /**
     * @public
     * @param {Vector2} initialVectorComponents - vector components (in view coordinates)
     * @param {VectorColorGroups} vectorColorGroup - vector color group of the vector that the icon represents
     * @param {Object} [options]
     * @returns {ArrowNode}
     */
    createVectorCreatorPanelIcon( initialVectorComponents, vectorColorGroup, options ) {

      assert && assert( initialVectorComponents instanceof Vector2 );
      assert && assert( vectorColorGroup && VectorColorGroups.includes( vectorColorGroup ) );

      options = merge( {
        arrowLength: 30, // {number} length of the arrow
        arrowOptions: _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
          cursor: 'pointer',
          fill: VectorAdditionColors[ vectorColorGroup ].fill
        } )
      }, options );

      const arrowComponents = initialVectorComponents.normalized().timesScalar( options.arrowLength );
      return new ArrowNode( 0, 0, arrowComponents.x, arrowComponents.y, options.arrowOptions );
    },

    //========================================================================================
    // 3. Checkbox icons (i.e. sum icon, angle icon)
    //========================================================================================

    /**
     * Creates the icon that appears next to the 'Sum' checkbox on the control panel
     * @public
     * @param {VectorColorGroups} vectorColorGroup
     * @param {Object} [options]
     * @returns {Node}
     */
    createSumIcon: ( vectorColorGroup, options ) => {

      assert && assert( vectorColorGroup && VectorColorGroups.includes( vectorColorGroup ) );

      options = merge( {
        arrowOptions: _.extend( {}, VectorAdditionConstants.SUM_VECTOR_OPTIONS, {
          fill: VectorAdditionColors[ vectorColorGroup ].sum
        } ),
        arrowLength: 22     // {number} length of the sum arrow node
      }, options );

      return new ArrowNode( 0, 0, options.arrowLength, 0, options.arrowOptions );
    },

    /**
     * Creates the icon that appears next to the checkbox that toggles the 'Angle' visibility
     * @public
     * @param {Object} [options]
     * @returns {Node}
     */
    createAngleIcon( options ) {
      options = merge( {
        angle: Util.toRadians( 50 ),  // {number} in radians
        curvedArrowRadius: 16,        // {number} in view coordinates
        wedgeLength: 20,              // {number} length of the wedge
        curvedArrowOptions: VectorAdditionConstants.ANGLE_ARROW_OPTIONS
      }, options );

      const wedgeShape = new Shape()
        .moveTo( options.wedgeLength, 0 )
        .horizontalLineTo( 0 )
        .lineTo( Math.cos( options.angle ) * options.wedgeLength, -Math.sin( options.angle ) * options.wedgeLength );

      return new Node().setChildren( [
        new Path( wedgeShape, { stroke: VectorAdditionColors.BLACK } ),
        new CurvedArrowNode( options.curvedArrowRadius, options.angle, options.curvedArrowOptions )
      ] );
    },

    //========================================================================================
    // 4. Component Style Radio Button Icons
    //========================================================================================

    /**
     * Creates the icons that go on the Component Style Radio Button based on a component style
     * @public
     * @param {ComponentStyles} componentStyle
     * @param {Object} [options]
     * @returns {Node}
     */
    createComponentStyleRadioButtonIcon( componentStyle, options ) {

      assert && assert( ComponentStyles.includes( componentStyle ) );

      options = merge( {
        componentArrowOptions: RADIO_BUTTON_COMPONENT_VECTOR_OPTIONS,
        arrowSize: 29,                        // {number} size (width and/or height) or arrow nodes
        subBoxSize: 10,                       // {number} size of the sub-box the arrow/on-axis lines creates
        lineDash: [ 2.9, 2 ],                 // {number[]} line dash for the on-axis lines
        stroke: VectorAdditionColors.BLACK    // {string|Color} stroke of the on-axis lines
      }, options );

      if ( componentStyle === ComponentStyles.INVISIBLE ) {
        return createRadioButtonIcon( new FontAwesomeNode( 'eye_close', { scale: 0.75 } ) );
      }

      const arrowSize = options.arrowSize; // convenience reference

      // Initialize arrow nodes for the PARALLELOGRAM component style (will be adjusted for different component styles)
      const vectorArrow = new ArrowNode( 0, 0, arrowSize, -arrowSize, RADIO_BUTTON_VECTOR_OPTIONS );
      const xComponentArrow = new ArrowNode( 0, 0, arrowSize, 0, options.componentArrowOptions );
      const yComponentArrow = new ArrowNode( 0, 0, 0, -arrowSize, options.componentArrowOptions );

      let iconChildren = [ xComponentArrow, yComponentArrow, vectorArrow ]; // children of the icon children

      if ( componentStyle === ComponentStyles.TRIANGLE ) {
        yComponentArrow.setTailAndTip( arrowSize, 0, arrowSize, -arrowSize );
      }
      else if ( componentStyle === ComponentStyles.ON_AXIS ) {
        vectorArrow.setTailAndTip( options.subBoxSize, -options.subBoxSize, arrowSize, -arrowSize );
        xComponentArrow.setTailAndTip( options.subBoxSize, 0, arrowSize, 0 );
        yComponentArrow.setTailAndTip( 0, -options.subBoxSize, 0, -arrowSize );

        // Create the on-axis lines
        const dashedLineShape = new Shape().moveTo( 0, -options.subBoxSize )
          .horizontalLineTo( options.subBoxSize )
          .verticalLineToRelative( options.subBoxSize )
          .moveTo( 0, -arrowSize )
          .horizontalLineTo( arrowSize )
          .verticalLineToRelative( arrowSize );

        const dashedLinePath = new Path( dashedLineShape, { lineDash: options.lineDash, stroke: options.stroke } );

        iconChildren = [ dashedLinePath, xComponentArrow, yComponentArrow, vectorArrow ];
      }
      
      return createRadioButtonIcon( new Node().setChildren( iconChildren ) );
    },

    //========================================================================================
    // 5. Coordinate Snap Mode Icons (polar/cartesian, see https://github.com/phetsims/vector-addition/issues/21)
    //========================================================================================

    /**
     * Creates the icon used on the radio buttons toggles the coordinate snap mode
     * @public
     * @param {CoordinateSnapModes} coordinateSnapMode
     * @param {Object} [options]
     * @returns {Node}
     */
    createCoordinateSnapModeIcon( coordinateSnapMode, options ) {

      assert && assert( CoordinateSnapModes.includes( coordinateSnapMode ) );
      const isPolar = coordinateSnapMode === CoordinateSnapModes.POLAR; // convenience reference
      //----------------------------------------------------------------------------------------
      options = merge( {
        arrowSize: isPolar ? 27.5 : 26.5,  // {number} size of the arrow
        arrowOptions: _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
          fill: isPolar ? VectorAdditionColors.PURPLE : RADIO_BUTTON_VECTOR_OPTIONS.fill
        } ),
        curvedArrowOptions: VectorAdditionConstants.ANGLE_ARROW_OPTIONS,
        cartesianTopMargin: 5.5,           // {number} top margin of the radio button icon for cartesian
        cartesianLeftMargin: 2.9,          // {number} left margin of the radio button icon for cartesian
        arcRadius: 20                      // {number} arc radius of the curved arrow
      }, options );

      //----------------------------------------------------------------------------------------
      const arrowSize = options.arrowSize; // convenience reference
      const labelFont = RADIO_BUTTON_TEXT_FONT; // convenience reference
      const children = [];

      // Create the arrow node that is 45 degrees to the right and up
      const arrow = new ArrowNode( 0, 0, arrowSize, -arrowSize, options.arrowOptions );

      if ( !isPolar ) {
        const componentArrowOptions = _.extend( {}, options.arrowOptions, { fill: VectorAdditionColors.BLACK } );

        const xArrow = new ArrowNode( 0, 0, arrowSize, 0, componentArrowOptions );
        const yArrow = new ArrowNode( arrowSize, 0, arrowSize, -arrowSize, componentArrowOptions );
        const xLabel = new Text( '1', { font: labelFont, top: xArrow.centerY, centerX: xArrow.centerX } );
        const yLabel = new Text( '1', { font: labelFont, centerY: yArrow.centerY + 3, left: yArrow.right - 2 } );

        children.push( xArrow, yArrow, arrow, xLabel, yLabel ); // z-layering
      }
      else {
        const curvedArrow = new CurvedArrowNode( options.arcRadius, Util.toRadians( 45 ), options.curvedArrowOptions );
        const line = new Line( 0, 0, options.arrowSize, 0, { stroke: VectorAdditionColors.BLACK } );
        const arrowLabel = new Text( '1', { bottom: arrow.centerY, right: arrow.centerX, font: labelFont } );
        children.push( arrow, curvedArrow, line, arrowLabel ); // z-layering
      }

      return createRadioButtonIcon( new Node().setChildren( children ), !isPolar ? {
        topMargin: options.cartesianTopMargin,
        leftMargin: options.cartesianLeftMargin
      } : null );
    },

    //========================================================================================
    // 6. Graph Orientation Icons (horizontal/vertical)
    //========================================================================================

    /**
     * Creates the icon used on the radio buttons on 'Explore 1D' screen that toggles the graph orientation.
     * @public
     * @param {GraphOrientations} graphOrientation - orientation of the graph (has to be horizontal or vertical)
     * @param {Object} [options]
     * @returns {ArrowNode}
     */
    createGraphOrientationIcon( graphOrientation, options ) {

      assert && assert( _.includes( [ GraphOrientations.HORIZONTAL, GraphOrientations.VERTICAL ], graphOrientation ) );

      options = merge( {
        arrowOptions: VectorAdditionConstants.AXES_ARROW_OPTIONS,
        arrowLength: 37  // {number} length of the arrow node
      }, options );

      //----------------------------------------------------------------------------------------
      if ( graphOrientation === GraphOrientations.HORIZONTAL ) {
        return new ArrowNode( 0, 0, options.arrowLength, 0, options.arrowOptions );
      }
      else if ( graphOrientation === GraphOrientations.VERTICAL ) {
        return new ArrowNode( 0, 0, 0, options.arrowLength, options.arrowOptions );
      }
    },

    //========================================================================================
    // 7. Equation Types Icons
    //========================================================================================

    /**
     * Creates the Icon that appears on the Equation Types radio button icons on the 'Equation' screen.
     * @public
     * @param {EquationTypes} equationType
     * @param {Array.<string>} vectorSymbols - vector symbols (the last symbol is the sum's symbol)
     * @param {Object} [options]
     * @returns {Node}
     */
    createEquationTypeIcon( equationType, vectorSymbols, options ) {

      assert && assert( EquationTypes.includes( equationType ), `invalid equationType: ${equationType}` );
      assert && assert( _.every( vectorSymbols, symbol => typeof symbol === 'string' ) && vectorSymbols.length > 1 );

      options = _.extend( {
        font: new PhetFont( { weight: '500', size: 14 } ),  // {PhetFont|Font} font of the equation text
        spacing: 4.5,
        symbolOptions: {
          formulaNodeScale: 0.83
        },
        width: 99,  // {number} width of the icon
        height: 25  // {number} height of the icon
      }, options );

      //----------------------------------------------------------------------------------------

      let iconChildren = [];

      // Gather all the symbols on the left side of the equation into an array (for NEGATION, all symbols are on the
      // left side of the equation)
      const equationLeftSideSymbols = _.dropRight( vectorSymbols, equationType === EquationTypes.NEGATION ? 0 : 1 );

      equationLeftSideSymbols.forEach( symbol => {
        iconChildren.push( new VectorSymbolNode( symbol, null, false, options.symbolOptions ) );
      } );

      // Interleave signs (i.e. '+'/'-') in between each symbol on the left side of the equation
      iconChildren = interleave( iconChildren, () => {
        return new Text( equationType === EquationTypes.SUBTRACTION ? MathSymbols.MINUS : MathSymbols.PLUS, { font: options.font } );
      } );

      // Add the second half of the equation, which is a '=' and the last of the symbols (which is the sum) or a '0'
      iconChildren.push( new Text( MathSymbols.EQUAL_TO, { font: options.font } ),
        equationType === EquationTypes.NEGATION ? new Text( '0', { font: options.font } ) : new VectorSymbolNode( _.last( vectorSymbols ), null, false, options.symbolOptions ) );

      return createRadioButtonIcon( new HBox( { children: iconChildren, spacing: options.spacing } ), {
        width: options.width,
        height: options.height
      } );
    }
  };

  //========================================================================================
  // Helper functions
  //========================================================================================

  /**
   * Creates a RadioButton Icon but aligns a given icon in an AlignBox to ensure the correct alignment and localBounds.
   * This allows icons of different sizes and groups to have the same localBounds to fit in the same sized RadioButton.
   *
   * @param {Node} icon
   * @param {Object} [options]
   * @returns {AlignBox}
   */
  function createRadioButtonIcon( icon, options ) {

    assert && assert( icon instanceof Node, `invalid icon: ${icon}` );

    options = _.extend( {
      width: 38.5,     // {number} local width of the icon
      height: 37,      // {number} local height of the icon
      topMargin: 0,    // {number} right margin of the icon
      leftMargin: 0    // {number} left margin of the icon
    }, options );

    icon.maxWidth = options.width;
    icon.maxHeight = options.height;

    return new AlignBox( icon, {
      alignBounds: new Bounds2( 0, 0, options.width, options.height ),
      topMargin: options.topMargin,
      leftMargin: options.leftMargin
    } );
  }

  /**
   * Creates Vector Icons (ArrowNode) tip to tail based on an array of tip locations along the tail location of the
   * first Vector. ArrowNodes are created and pushed to a given array.
   *
   * @param {Vector2[]} tipLocations - tip locations of all vectors (vectors are aligned tip to tail)
   * @param {Vector2} startingTailLocation - tail location of the first vector
   * @param {Object} [arrowOptions] - passed to arrow nodes
   * @returns {Array.<ArrowNode>}
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

  return vectorAddition.register( 'VectorAdditionIconFactory', VectorAdditionIconFactory );
} );