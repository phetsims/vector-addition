// Copyright 2019, University of Colorado Boulder

/**
 * Factory (uses static methods, so no instance is required) for creating the various icons that appear in the sim.
 *
 * ## Creates the following icons:
 *  - Screen icons
 *  - Vector Creator Panel Vector icons
 *  - Checkbox icons (i.e. sum checkbox, angle checkbox, grid checkbox)
 *  - Component Projection Icons (for each radio button)
 *  - Coordinate Snap Mode Icons (polar/cartesian)
 *  - Graph orientation icons (horizontal/vertical - on the 'Explore 1D' screen)
 *  - Equation Type icons (On the 'Equation' Screen)
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
  const CurvedArrowNode = require( 'VECTOR_ADDITION/common/view/CurvedArrowNode' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Screen = require( 'JOIST/Screen' );
  const ScreenIcon = require( 'JOIST/ScreenIcon' );
  const Shape = require( 'KITE/Shape' );
  const Spacer = require( 'SCENERY/nodes/Spacer' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );

  //----------------------------------------------------------------------------------------
  // constants

  // default VectorColorGroup for icons.
  const DEFAULT_COLOR_GROUP = VectorAdditionConstants.DEFAULT_COLOR_GROUP;

  // screen icons
  const SCREEN_ICON_WIDTH = 70;
  const SCREEN_ICON_HEIGHT = SCREEN_ICON_WIDTH / Screen.HOME_SCREEN_ICON_ASPECT_RATIO; // w/h = ratio <=> h = w/ratio
  const SCREEN_ICON_ARROW_OPTIONS = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
    fill: VectorAdditionColors[ DEFAULT_COLOR_GROUP ].fill
  } );

  // size (width and height) of all arrow nodes inside of radio buttons
  const RADIO_BUTTON_ARROW_SIZE = 29;

  // defaults for all arrow node instances
  const ARROW_ICON_OPTIONS = {
    fill: VectorAdditionColors[ DEFAULT_COLOR_GROUP ].fill,
    stroke: VectorAdditionColors.BLACK,
    lineWidth: 0.5,
    headHeight: 6.5,
    headWidth: 10.5,
    tailWidth: 3.9
  };

  // default font on text inside of icons that go in radio buttons
  const RADIO_BUTTON_TEXT_FONT = new PhetFont( { size: 11, family: 'Times', weight: '500' } );

  // default options for opaque arrows
  const OPAQUE_ARROW_OPTIONS = _.extend( {}, ARROW_ICON_OPTIONS, { opacity: 0.4 } );


  class VectorAdditionIconFactory {

    /**
     * Creates the Icon for the 'Explore 1D' Screen
     * @public
     * @param {Object} [options]
     * @returns {ScreenIcon}
     */
    static createExplore1DScreenIcon( options ) {

      //----------------------------------------------------------------------------------------
      // The Icon for the 'Explore 1D' Screen contains a left facing arrow and a right facing arrow.
      // See https://github.com/phetsims/vector-addition/issues/76 for a visual.
      options = _.extend( {
        rightArrowWidth: SCREEN_ICON_WIDTH,       // {number} width of the right arrow
        leftArrowWidth: SCREEN_ICON_WIDTH * 0.33, // {number} width of the left arrow
        arrowSpacing: SCREEN_ICON_HEIGHT * 0.45   // {number} vertical spacing between the left and right arrow
      }, options );

      const rightArrow = new ArrowNode( 0, 0, SCREEN_ICON_WIDTH, 0, SCREEN_ICON_ARROW_OPTIONS );
      const leftArrow = new ArrowNode( SCREEN_ICON_WIDTH,
        options.arrowSpacing,
        SCREEN_ICON_WIDTH - options.leftArrowWidth,
        options.arrowSpacing,
        SCREEN_ICON_ARROW_OPTIONS );
      return createScreenIcon( [ rightArrow, leftArrow ] );
    }

    /**
     * Creates the Icon for the 'Explore 2D' Screen
     * @public
     * @param {Object} [options]
     * @returns {ScreenIcon}
     */
    static createExplore2DScreenIcon( options ) {

      //----------------------------------------------------------------------------------------
      // The 'Explore 2D' Screen icon contains an arrow facing up and to the right and 2 component arrows.
      // See https://github.com/phetsims/vector-addition/issues/76 for a visual.
      options = _.extend( {
        arrowComponents: new Vector2( SCREEN_ICON_WIDTH, -SCREEN_ICON_HEIGHT ) // {Vector2} arrow view components
      }, options );

      const arrowComponents = options.arrowComponents; // convenience reference

      // Arrow Options for the component arrows
      const componentArrowOptions = _.extend( {}, SCREEN_ICON_ARROW_OPTIONS, {
        fill: VectorAdditionColors[ DEFAULT_COLOR_GROUP ].component
      } );

      const arrow = new ArrowNode( 0, 0, arrowComponents.x, arrowComponents.y, SCREEN_ICON_ARROW_OPTIONS );
      const xArrow = new ArrowNode( 0, 0, arrowComponents.x, 0, componentArrowOptions );
      const yArrow = new ArrowNode( arrowComponents.x, 0, arrowComponents.x, arrowComponents.y, componentArrowOptions );
      return createScreenIcon( [ xArrow, yArrow, arrow ] );
    }

    /**
     * Creates the Icon for the 'Lab' Screen
     * @public
     * @param {Object} [options]
     * @returns {ScreenIcon}
     */
    static createLabScreenIcon( options ) {

      //----------------------------------------------------------------------------------------
      // The 'Lab' Screen icon contains 4 arrows in a kite shape (2 for each vector set).
      // See https://github.com/phetsims/vector-addition/issues/76#issuecomment-515225420 for a visual.
      options = _.extend( {
        // {Vector2[]} the tip locations of the group 1 vectors of the icon (vectors are aligned tip to tail)
        group1TipLocations: [
          new Vector2( SCREEN_ICON_WIDTH * 0.63, 0 ),
          new Vector2( SCREEN_ICON_WIDTH, -SCREEN_ICON_HEIGHT )
        ],

        // {Vector2[]} the tip locations of the group 2 vectors of the icon (vectors are aligned tip to tail)
        group2TipLocations: [
          new Vector2( 0, -SCREEN_ICON_HEIGHT * 0.7 ),
          new Vector2( SCREEN_ICON_WIDTH, -SCREEN_ICON_HEIGHT )
        ],

        // {Vector2} the starting tail locations of the first vectors of both sets.
        startingTailLocation: new Vector2( SCREEN_ICON_WIDTH * 0.26, 0 )
      }, options );

      //----------------------------------------------------------------------------------------
      const group1ArrowOptions = SCREEN_ICON_ARROW_OPTIONS;
      const group2ArrowOptions = _.extend( {}, SCREEN_ICON_ARROW_OPTIONS, {
        fill: VectorAdditionColors[ VectorColorGroups.RED_COLOR_GROUP ].fill }
      );

      const iconChildren = [];

      addVectorsTipToTail( options.group2TipLocations, options.startingTailLocation, iconChildren, group2ArrowOptions );
      addVectorsTipToTail( options.group1TipLocations, options.startingTailLocation, iconChildren, group1ArrowOptions );

      return createScreenIcon( iconChildren );
    }

    /**
     * Creates the Icon for the 'Equation' Screen
     * @public
     * @param {Object} [options]
     * @returns {ScreenIcon}
     */
    static createEquationScreenIcon( options ) {

      //----------------------------------------------------------------------------------------
      // The 'Equation' Screen icon contains 2 arrows from tip to tail and the sum.
      // See https://github.com/phetsims/vector-addition/issues/76 for a visual.
      options = _.extend( {
        // {Vector2[]} the tip locations of the vectors on the icon (vectors are aligned tip to tail)
        tipLocations: [
          new Vector2( SCREEN_ICON_WIDTH* 0.15, -SCREEN_ICON_HEIGHT * 0.75 ),
          new Vector2( SCREEN_ICON_WIDTH* 0.85, -SCREEN_ICON_HEIGHT )
        ],
        startingTailLocation: Vector2.ZERO // {Vector2} starting tail location of all vectors
      }, options );

      const sumArrowOptions = _.extend( {}, SCREEN_ICON_ARROW_OPTIONS, {
        fill: VectorAdditionColors.EQUATION_SUM_FILL
      } );

      const iconChildren = [];

      addVectorsTipToTail( options.tipLocations, options.startingTailLocation,
                           iconChildren, SCREEN_ICON_ARROW_OPTIONS );

      // Add the sum vector
      iconChildren.push( new ArrowNode( options.startingTailLocation.x,
                                        options.startingTailLocation.y,
                                        _.last( options.tipLocations ).x,
                                        _.last( options.tipLocations ).y,
                                        sumArrowOptions ) );

      return createScreenIcon( iconChildren );
    }

    /**
     * Creates the Vector Icon that appears on the vector creator panel
     * @public
     * @param {Vector2} initialVectorComponents - vector components (in model coordinates)
     * @param {VectorColorGroups} vectorColorGroup - vector color group of the vector that the icon represents
     * @param {Object} [options]
     * @returns {ArrowNode}
     */
    static createVectorCreatorPanelIcon( initialVectorComponents, vectorColorGroup, options ) {
      assert && assert( initialVectorComponents instanceof Vector2 );
      assert && assert( vectorColorGroup && VectorColorGroups.includes( vectorColorGroup ) );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
        // arrow node options
        tailWidth: 2.5,
        cursor: 'pointer',
        fill: VectorAdditionColors[ vectorColorGroup ].fill,

        // specific to this function
        arrowLength: 30 // {number} length of the arrow
      }, options );

      const vectorComponentsView = initialVectorComponents.normalized().timesScalar( options.arrowLength );
      return new ArrowNode( 0, 0, vectorComponentsView.x, vectorComponentsView.y, options );
    }

    /**
     * Creates the icon used on the radio buttons on 'Explore1D' that toggle the graph orientation (horizontal/vertical)
     * @public
     * @param (GraphOrientations} graphOrientation - orientation of the graph (has to be horizontal or vertical)
     * @param {Object} [options]
     * @returns {ArrowNode}
     */
    static createGraphOrientationIcon( graphOrientation, options ) {
      assert && assert( graphOrientation && GraphOrientations.includes( graphOrientation )
      && graphOrientation !== GraphOrientations.RED_COLOR_GROUP_DIMENSONAL );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {
        // All options are for arrow node
        fill: VectorAdditionColors.BLACK,
        doubleHead: true,
        tailWidth: 3,
        headWidth: 8,
        headHeight: 10,
        arrowLength: 40
      }, options );

      //----------------------------------------------------------------------------------------
      if ( graphOrientation === GraphOrientations.HORIZONTAL ) {
        return new ArrowNode( 0, 0, options.arrowLength, 0, options );
      }
      else if ( graphOrientation === GraphOrientations.VERTICAL ) {
        return new ArrowNode( 0, 0, 0, options.arrowLength, options );
      }
    }

    /**
     * Creates the icon that appears next to the 'Sum' checkbox on the control panel
     * @public
     * @param {VectorColorGroups} vectorColorGroup
     * @param {Object} [options]
     * @returns {Node}
     */
    static createSumIcon( vectorColorGroup, options ) {
      assert && assert( vectorColorGroup && VectorColorGroups.includes( vectorColorGroup ) );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {}, ARROW_ICON_OPTIONS, {
        // for arrow node
        lineWidth: 1,
        tailWidth: 3.8,
        headHeight: 7.2,
        fill: VectorAdditionColors[ vectorColorGroup ].sum,

        // specific to this
        arrowLength: 22
      }, options );

      return new ArrowNode( 0, 0, options.arrowLength, 0, options );
    }

    /**
     * Creates the icon that appears next to the checkbox that toggles the 'Angle' visibility
     * @public
     * @param {Object} [options]
     * @returns {Node}
     */
    static createAngleIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {
        // all are specific to this
        angle: Util.toRadians( 50 ), // {number} in radians
        curvedArrowRadius: 14, // {number}
        wedgeLength: 20, // {number} - length of the wedge
        curvedArrowOptions: null
      }, options );

      options.curvedArrowOptions = _.extend( {
        arrowheadWidth: 6,
        arrowheadHeight: 4.2,
        arcOptions: { lineWidth: 1.3 }
      }, options.curvedArrowOptions );

      // Create the wedge (bottom left as the origin)
      const wedgeShape = new Shape().moveTo( options.wedgeLength, 0 )
        .horizontalLineTo( 0 )
        .lineTo( Math.cos( options.angle ) * options.wedgeLength, -Math.sin( options.angle ) * options.wedgeLength );

      return new Node().setChildren( [ new Path( wedgeShape, { stroke: VectorAdditionColors.BLACK } ),
        new CurvedArrowNode( options.curvedArrowRadius, options.angle, options.curvedArrowOptions ) ] );
    }

    /**
     * Creates the icon that appears next to the checkbox that toggles the Grid visibility
     * @public
     * @param {Object} [options]
     * @returns {Node}
     */
    static createGridIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {
        rows: 3, // {number}
        cols: 3, // {number}
        gridLineSpacing: 6, // {number} spacing between each grid line
        gridPathOptions: null // {object} defaults bellow
      }, options );

      options.gridPathOptions = _.extend( {
        stroke: VectorAdditionColors.GRID_ICON_COLOR // {string}
      }, options.gridPathOptions );

      const gridShape = new Shape();

      // Draw each row
      for ( let row = 0; row < options.rows; row++ ) {
        gridShape.moveTo( 0, row * ( options.gridLineSpacing ) + options.gridLineSpacing )
          .horizontalLineTo( ( options.cols + 1 ) * options.gridLineSpacing );
      }
      // Draw each col
      for ( let col = 0; col < options.cols; col++ ) {
        gridShape.moveTo( col * ( options.gridLineSpacing ) + options.gridLineSpacing, 0 )
          .verticalLineTo( ( options.rows + 1 ) * options.gridLineSpacing );
      }
      return new Path( gridShape, options.gridPathOptions );
    }

    /**
     * Creates the icons that appear on the component style radio button group
     * @public
     * @param {ComponentStyles} componentStyle
     * @param {Object} [options]
     * @returns {Node}
     */
    static createComponentStyleIcon( componentStyle, options ) {
      assert && assert( componentStyle && ComponentStyles.includes( componentStyle ) );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );
      switch( componentStyle ) {
        case ComponentStyles.INVISIBLE:
          return this.createInvisibleComponentStyleIcon( options );
        case ComponentStyles.PARALLELOGRAM:
          return this.createParallelogramComponentStyleIcon( options );
        case ComponentStyles.TRIANGLE:
          return this.createTriangleComponentStyleIcon( options );
        case ComponentStyles.ON_AXIS:
          return this.createOnAxisComponentStyleIcon( options );
        default:
          throw new Error( `invalid componentStyle: ${componentStyle}` );
      }
    }

    /**
     * Creates the Icon for the invisible component display style on the component radio button
     * @private
     * @param {Object} [options]
     * @returns {Node}
     */
    static createInvisibleComponentStyleIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( { maxWidth: RADIO_BUTTON_ARROW_SIZE + 7.5 } );
      return this.createRadioButtonIcon( new FontAwesomeNode( 'eye_close', options ) );
    }

    /**
     * Creates the Icon for the parallelogram component radio button
     * @private
     * @param {Object} [options]
     * @returns {Node}
     */
    static createParallelogramComponentStyleIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      const vectorArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ARROW_SIZE, -RADIO_BUTTON_ARROW_SIZE, ARROW_ICON_OPTIONS );
      const xComponentArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ARROW_SIZE, 0, OPAQUE_ARROW_OPTIONS );
      const yComponentArrow = new ArrowNode( 0, 0, 0, -RADIO_BUTTON_ARROW_SIZE, OPAQUE_ARROW_OPTIONS );

      return this.createRadioButtonIcon( new Node( _.extend( {
        children: [ xComponentArrow, yComponentArrow, vectorArrow ]
      }, options ) ) );
    }

    /**
     * Creates the Icon for the triangle component radio button
     * @private
     * @param {Object} [options]
     * @returns {Node}
     */
    static createTriangleComponentStyleIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      const vectorArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ARROW_SIZE, -RADIO_BUTTON_ARROW_SIZE, ARROW_ICON_OPTIONS );
      const xComponentArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ARROW_SIZE, 0, OPAQUE_ARROW_OPTIONS );
      const yComponentArrow = new ArrowNode( RADIO_BUTTON_ARROW_SIZE, 0, RADIO_BUTTON_ARROW_SIZE,
        -RADIO_BUTTON_ARROW_SIZE, OPAQUE_ARROW_OPTIONS );

      return this.createRadioButtonIcon( new Node( _.extend( {
        children: [ xComponentArrow, yComponentArrow, vectorArrow ]
      }, options ) ) );
    }

    /**
     * Creates the Icon for the on axis component radio button
     * @private
     * @param {Object} [options]
     * @returns {Node}
     */
    static createOnAxisComponentStyleIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );
      options = _.extend( {
        subBoxSize: 10,
        lineDash: [ 2, 2 ],
        stroke: VectorAdditionColors.BLACK
      }, options );

      const vectorArrow = new ArrowNode( options.subBoxSize,
        -options.subBoxSize,
        RADIO_BUTTON_ARROW_SIZE,
        -RADIO_BUTTON_ARROW_SIZE,
        ARROW_ICON_OPTIONS );

      const xArrow = new ArrowNode( options.subBoxSize, 0, RADIO_BUTTON_ARROW_SIZE, 0, OPAQUE_ARROW_OPTIONS );
      const yArrow = new ArrowNode( 0, -options.subBoxSize, 0, -RADIO_BUTTON_ARROW_SIZE, OPAQUE_ARROW_OPTIONS );

      const dashedLineShape = new Shape().moveTo( 0, -options.subBoxSize )
        .horizontalLineTo( options.subBoxSize )
        .verticalLineToRelative( options.subBoxSize )
        .moveTo( 0, -RADIO_BUTTON_ARROW_SIZE )
        .horizontalLineTo( RADIO_BUTTON_ARROW_SIZE )
        .verticalLineToRelative( RADIO_BUTTON_ARROW_SIZE );

      const dashedLinePath = new Path( dashedLineShape, { lineDash: options.lineDash, stroke: options.stroke } );

      return this.createRadioButtonIcon( new Node().setChildren( [ xArrow, yArrow, dashedLinePath, vectorArrow ] ) );
    }

    /**
     * Creates the Icon for the cartesian coordinate snap mode radio button
     * @public
     * @param {Object} [options]
     * @returns {Node}
     */
    static createCartesianIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {
        arrowSize: 25, // {number}
        topMargin: 5, // {number}
        leftMargin: 1.4, // {number}
        labelArrowMargin: 2, // {number}
        offsetYLabel: 3, // {number}
        componentArrowOptions: null,
        cartesianArrowOptions: null
      }, options );
      options.cartesianArrowOptions = _.extend( {}, ARROW_ICON_OPTIONS, {
        lineWidth: 0,
        headHeight: 7.5,
        tailWidth: 4.2
      } );
      options.componentArrowOptions = _.extend( {}, ARROW_ICON_OPTIONS, {
        fill: VectorAdditionColors.BLACK,
        tailWidth: 3.1,
        headHeight: 7.3,
        headWidth: 9.3
      }, options.componentArrowOptions );

      const arrowSize = options.arrowSize;

      const xArrow = new ArrowNode( 0, 0, arrowSize, 0, options.componentArrowOptions );
      const yArrow = new ArrowNode( arrowSize, 0, arrowSize, -arrowSize, options.componentArrowOptions );
      const cartesianArrow = new ArrowNode( 0, 0, arrowSize, -arrowSize, options.cartesianArrowOptions );

      const xLabel = new Text( '1', {
        font: RADIO_BUTTON_TEXT_FONT,
        top: xArrow.centerY,
        centerX: xArrow.centerX
      } );
      const yLabel = new Text( '1', {
        font: RADIO_BUTTON_TEXT_FONT,
        centerY: yArrow.centerY + options.offsetYLabel,
        left: yArrow.centerX + options.labelArrowMargin
      } );

      return this.createRadioButtonIcon( new Node().setChildren( [ xArrow, yArrow, cartesianArrow, xLabel, yLabel ] ), {
        topMargin: options.topMargin,
        leftMargin: options.leftMargin
      } );
    }

    /**
     * Creates the Icon for the cartesian coordinate polar mode radio button
     * @public
     * @param {Object} [options]
     * @returns {Node}
     */
    static createPolarIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );
      options = _.extend( {}, ARROW_ICON_OPTIONS, {
        arcRadius: 17,
        curvedArrowOptions: null,
        polarVectorOptions: null,
        arrowSize: 27.5
      }, options );

      options.polarVectorOptions = _.extend( {}, ARROW_ICON_OPTIONS, {
        lineWidth: 0,
        headHeight: 7.5,
        tailWidth: 4.2,
        fill: VectorAdditionColors.PURPLE
      } );

      options.curvedArrowOptions = _.extend( {
        arrowheadWidth: 5.5, // {number}
        arrowheadHeight: 5, // {number}
        arcOptions: { lineWidth: 1.2 }
      }, options.curvedArrowOptions );

      const polarVector = new ArrowNode( 0, 0, options.arrowSize, -options.arrowSize, options.polarVectorOptions );
      const arcArrow = new CurvedArrowNode( options.arcRadius, Util.toRadians( 45 ), options.curvedArrowOptions );
      const line = new Line( 0, 0, options.arrowSize, 0, { stroke: VectorAdditionColors.BLACK } );

      const arrowLabel = new Text( '1', {
        bottom: polarVector.centerY,
        right: polarVector.centerX - 2,
        font: RADIO_BUTTON_TEXT_FONT
      } );

      return this.createRadioButtonIcon( new Node().setChildren( [ arrowLabel, polarVector, arcArrow, line ] ) );
    }
 /**
     * Creates a radio button icon with ensured alignment and correct bounds.
     * @private
     * @param {Node} icon
     * @param {Object} [options]
     * @returns {AlignBox}
     */
    static createRadioButtonIcon( icon, options ) {

      assert && assert( icon instanceof Node, `invalid icon: ${icon}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {
        width: RADIO_BUTTON_ARROW_SIZE + 9.5,
        height: RADIO_BUTTON_ARROW_SIZE + 7.5,

        // for align box
        topMargin: 0,
        leftMargin: 0,
        alignX: 'center',
        alignY: 'center'
      }, options );

      return new AlignBox( icon, {
        alignBounds: new Bounds2( 0, 0, options.width, options.height ),
        topMargin: options.topMargin,
        leftMargin: options.leftMargin,
        alignX: options.alignX,
        alignY: options.alignY
      } );
    }
    /**
     * Creates the Icon that appears on the equation types radio button group
     * @public
     * @param {EquationTypes} equationType
     * @param {array.<string>} vector symbols - array of the vector symbols. It is assumed the last vector symbol is the
     *                                          sum.
     * @param {Object} [options]
     * @returns {Node}
     */
    static createEquationTypesIcon( equationType, vectorSymbols, options ) {
      assert && assert( EquationTypes.includes( equationType ), `invalid equationType: ${equationType}` );
      assert && assert( vectorSymbols.filter( symbol => typeof symbol === 'string' ).length === vectorSymbols.length );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {
        font: new PhetFont( 12 ),
        width: 80,
        height: 20
      } );

      // insert signs (+/-/=) in between each symbol (excluding the sum symbol)
      const contentArray = _.flatMap( _.dropRight( vectorSymbols ), ( symbol, index, array ) => {
        return index !== array.length - 1 ? [ symbol, equationType === EquationTypes.SUBTRACTION ? '-' : '+' ] :
               symbol;
      } );

      // Add the second half of the equation
      if ( equationType === EquationTypes.ADDITION || equationType === EquationTypes.SUBTRACTION ) {
        contentArray.push( '=', _.last( vectorSymbols ) );
      }
      else if ( equationType === EquationTypes.NEGATION ) {
        contentArray.push( '+', _.last( vectorSymbols ), '=', '0' );
      }

      return this.createRadioButtonIcon( new Text( _.join( contentArray, ' ' ), { font: options.font } ), {
        width: options.width,
        height: options.height
      } );
    }
  }


  /**
   * Adds Vector Arrow Nodes based on an array of tip locations (vectors are aligned tip to tail) to an array
   * @param {Vector2[]} tipLocations
   * @param {Vector2} startingTailLocation - tail location of the first vector
   * @param {array} array - array to add the vector arrow nodes to
   * @param {Object} [arrowOptions]
   */
  function addVectorsTipToTail( tipLocations, startingTailLocation, array, arrowOptions ) {

    assert && assert( _.every( tipLocations, tip => tip instanceof Vector2 ) );
    assert && assert( startingTailLocation instanceof Vector2 );

    for ( let i = 0; i < tipLocations.length; i++ ) {
      if ( i === 0 ) {
        array.push( new ArrowNode( startingTailLocation.x, startingTailLocation.y,
                                          tipLocations[ 0 ].x, tipLocations[ 0 ].y, arrowOptions ) );
      }
      else {
        array.push( new ArrowNode( tipLocations[ i - 1 ].x, tipLocations[ i - 1 ].y,
                                          tipLocations[ i ].x, tipLocations[ i ].y, arrowOptions ) );
      }
    }
  }

  /**
   * Creates a Screen Icon, ensuring the correct width and height. Aligning icons in the same align box
   * ensures that the tail width of the arrows are the same for every screen icon. See
   * https://github.com/phetsims/vector-addition/issues/76#issuecomment-515197547.
   *
   * @param {Node[]} children - the children of the icon
   * @returns {ScreenIcon}
   */
  function createScreenIcon( children ) {

    assert && assert( _.every( children, child => child instanceof Node ) );

    const iconNode = new Node().addChild( new Spacer( SCREEN_ICON_WIDTH, SCREEN_ICON_HEIGHT, { pickable: false } ) );

    iconNode.addChild( new Node( {
      children: children,
      center: iconNode.center
    } ) );
    return new ScreenIcon( iconNode );
  }

  vectorAddition.register( 'VectorAdditionIconFactory', VectorAdditionIconFactory );

  return VectorAdditionIconFactory;
} );